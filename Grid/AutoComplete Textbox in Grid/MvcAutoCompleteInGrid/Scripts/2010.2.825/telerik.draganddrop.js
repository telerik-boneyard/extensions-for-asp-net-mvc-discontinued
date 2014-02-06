(function ($) {
    var $t = $.telerik;
    var dragClueOffset = 10;

    $t.draganddrop = function (_namespace, options) {

        if (!(this instanceof arguments.callee))
            return new arguments.callee(_namespace, options);

        this.hitTestOffset = 5;

        $.extend(this, options)

        _namespace = '.' + (_namespace || 'draganddrop');
        
        var draggables = options.draggables;

        $.each($.isArray(draggables) ? draggables : [draggables], $.proxy(function(_, draggable) {
            $(draggable).live('mousedown', $.proxy(this.waitForDrag, this))
                        .live('dragstart', $t.preventDefault);
        }, this))
        
        this.evt = { ss: 'selectstart' + _namespace, mm: 'mousemove' + _namespace,
            ku: 'keyup' + _namespace, mu: 'mouseup' + _namespace
        };
    };

    $t.draganddrop.applyContext = function (object, context) {
        var result = {};

        $.each(object, function (item) {
            result[item] = $.isFunction(this) ? $.proxy(this, context) : this;
        });

        return result;
    };

    $t.draganddrop.prototype = {

        moveClue: function (e) {
            
            if (!this.useDragClue) {
                this.onDragMove(e, this.$draggedElement);
                return;
            }

            this.$dragClue.css({
                left: e.pageX + dragClueOffset,
                top: e.pageY + dragClueOffset
            });

            var status = this.onDragMove(e, this.$draggedElement, this.$dragClue) || 't-denied';

            this.$dragClueStatus.className = 't-icon t-drag-status ' + status;
        },

        startDrag: function (e) {
            var left = this.hittestCoordinates.left - e.pageX;
            var top = this.hittestCoordinates.top - e.pageY;
            var distance = Math.sqrt((top * top) + (left * left));

            if (distance >= this.hitTestOffset) {
                $(document)
                    .bind(this.evt.ss, function () { return false; })
                    .unbind(this.evt.mm);

                if (this.onDragStart(e, this.$draggedElement)) {
                    // drag cancelled
                }

                if (this.useDragClue) {
                    this.$dragClueStatus = $('<span class="t-icon t-drag-status t-denied" />')[0];

                    this.$dragClue =
                            $('<div class="t-header t-drag-clue" />')
                            .html(this.createDragClue(this.$draggedElement))
                            .prepend(this.$dragClueStatus)
                            .css({
                                left: e.pageX + dragClueOffset,
                                top: e.pageY + dragClueOffset
                            })
                            .appendTo(document.body);
                }

                $(document).bind(this.evt.mm, $t.stop(this.moveClue, this))
                           .bind(this.evt.ku, $t.stop(this.keyboardListener, this));

                this.dragStarted = true;
            }
        },

        removeDragClue: function () {
            if (this.$dragClue) {
                this.$dragClue.remove();
                this.$dragClue = null;
                this.$dragClueStatus = null;
            }
        },

        stopDrag: function (e) {

            if (this.dragStarted) {
                var onDropAction = this.onDrop(e, this.$draggedElement, this.useDragClue ? this.$dragClue : undefined);

                if (this.useDragClue && this.$dragClue) {
                    if (!onDropAction)
                        this.$dragClue.animate(this.$draggedElement.offset(), 'fast', $.proxy(this.removeDragClue, this));
                    else if (typeof onDropAction == 'function')
                        onDropAction($.proxy(this.removeDragClue, this));
                    else
                        this.removeDragClue();
                }

                this.dragStarted = false;
            }

            $(document).unbind([this.evt.ss, this.evt.mm, this.evt.mu, this.evt.ku].join(' '));
        },

        waitForDrag: function (e) {
            var $target = $(e.target);

            if (e.which !== 1 || !this.shouldDrag($target))
                return;

            this.$draggedElement = $target;

            this.hittestCoordinates = {
                left: e.pageX,
                top: e.pageY
            };

            $(document).bind(this.evt.mm, $t.stop(this.startDrag, this))
                       .bind(this.evt.mu, $t.stop(this.stopDrag, this));

            if (this.hitTestOffset == 0)
                this.startDrag(e);

            $(document).trigger('mousedown', e);

            return false;
        },

        keyboardListener: function (e) {
            // cancel drag on Esc
            if (e.keyCode == 27) {
                $(document).unbind([this.evt.ss, this.evt.mm, this.evt.mu, this.evt.ku].join(' '));
                this.onDragCancelled(e, this.$draggedElement);

                if (this.useDragClue && this.$dragClue)
                    this.$dragClue.animate(this.$draggedElement.offset(), 'fast', $.proxy(this.removeDragClue, this));

                this.dragStarted = false;
            }
        }
    };

})(jQuery);