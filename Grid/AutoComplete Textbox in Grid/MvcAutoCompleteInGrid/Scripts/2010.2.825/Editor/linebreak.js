function ParagraphCommand(options) {
    Command.call(this, options);

    this.exec = function () {
        var range = this.getRange();

        var document = documentFromRange(range);

        var emptyParagraphContent = $.browser.msie ? '' : '<br _moz_dirty="" />';

        // necessary while the emptyParagraphContent is empty under IE
        var startInBlock = dom.parentOfType(range.startContainer, ['p']),
            endInBlock = dom.parentOfType(range.endContainer, ['p']),
            shouldTrim = (startInBlock && !endInBlock) || (!startInBlock && endInBlock);

        range.deleteContents();

        var marker = dom.create(document, 'a');
        range.insertNode(marker);

        var li = dom.parentOfType(marker, 'li'.split(','));

        var next;

        if (li) {
            var rng = range.cloneRange();
            rng.selectNode(li);

            if (textNodes(rng).length == 0) {
                // hitting 'enter' in empty li
                var paragraph = dom.create(document, 'p');

                if (li.nextSibling)
                    split(rng, li.parentNode);

                dom.insertAfter(paragraph, li.parentNode);
                dom.remove(li.parentNode.childNodes.length == 1 ? li.parentNode : li);
                paragraph.innerHTML = emptyParagraphContent;
                next = paragraph;
            }
        }

        if (!next) {
            if (!li)
                new BlockFormatter([{ tags: ['p']}]).apply([marker]);

            range.selectNode(marker);

            var parent = dom.parentOfType(marker, [li ? 'li' : 'p']);

            split(range, parent, shouldTrim);

            var previous = parent.previousSibling;

            if (dom.is(previous, 'li') && previous.firstChild && !dom.is(previous.firstChild, 'br'))
                previous = previous.firstChild;

            next = parent.nextSibling;

            if (dom.is(next, 'li') && next.firstChild && !dom.is(next.firstChild, 'br'))
                next = next.firstChild;

            dom.remove(parent);

            if (previous.firstChild && dom.is(previous.firstChild, 'br'))
                dom.remove(previous.firstChild);

            if (isDataNode(previous) && previous.nodeValue == '')
                previous = previous.parentNode;

            if (previous && previous.innerHTML == '')
                previous.innerHTML = emptyParagraphContent;

            if (next.firstChild && dom.is(next.firstChild, 'br'))
                dom.remove(next.firstChild);

            if (isDataNode(next) && next.nodeValue == '')
                next = next.parentNode;

            if (next.innerHTML == '')
                next.innerHTML = emptyParagraphContent;

            // normalize updates the caret display in Gecko
            normalize(previous);
        }

        normalize(next);

        range.selectNodeContents(next);
        range.collapse(true);

        dom.scrollTo(next);

        selectRange(range);
    }
}

function NewLineCommand(options) {
    Command.call(this, options);

    this.exec = function () {
        var range = this.getRange();
        range.deleteContents();
        var br = dom.create(documentFromRange(range), 'br');
        range.insertNode(br);
        br.parentNode.normalize();
        if (!$.browser.msie && (!br.nextSibling || dom.isWhitespace(br.nextSibling))) { 
            //Gecko and WebKit cannot put the caret after only one br.
            var filler = br.cloneNode(true);
            filler.setAttribute('_moz_dirty', '');
            dom.insertAfter(filler, br);
        }
        range.setStartAfter(br);
        range.collapse(true);
        selectRange(range);
    }
};