﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ImageBrowserDBBinding.Models
{
	using System.Data.Linq;
	using System.Data.Linq.Mapping;
	using System.Data;
	using System.Collections.Generic;
	using System.Reflection;
	using System.Linq;
	using System.Linq.Expressions;
	using System.ComponentModel;
	using System;
	
	
	[global::System.Data.Linq.Mapping.DatabaseAttribute(Name="ImageBrowser")]
	public partial class FilesDataContext : System.Data.Linq.DataContext
	{
		
		private static System.Data.Linq.Mapping.MappingSource mappingSource = new AttributeMappingSource();
		
    #region Extensibility Method Definitions
    partial void OnCreated();
    partial void InsertFolder(Folder instance);
    partial void UpdateFolder(Folder instance);
    partial void DeleteFolder(Folder instance);
    partial void InsertImage(Image instance);
    partial void UpdateImage(Image instance);
    partial void DeleteImage(Image instance);
    #endregion
		
		public FilesDataContext() : 
				base(global::System.Configuration.ConfigurationManager.ConnectionStrings["ImageBrowserConnectionString"].ConnectionString, mappingSource)
		{
			OnCreated();
		}
		
		public FilesDataContext(string connection) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public FilesDataContext(System.Data.IDbConnection connection) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public FilesDataContext(string connection, System.Data.Linq.Mapping.MappingSource mappingSource) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public FilesDataContext(System.Data.IDbConnection connection, System.Data.Linq.Mapping.MappingSource mappingSource) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public System.Data.Linq.Table<Folder> Folders
		{
			get
			{
				return this.GetTable<Folder>();
			}
		}
		
		public System.Data.Linq.Table<Image> Images
		{
			get
			{
				return this.GetTable<Image>();
			}
		}
	}
	
	[global::System.Data.Linq.Mapping.TableAttribute(Name="dbo.Folders")]
	public partial class Folder : INotifyPropertyChanging, INotifyPropertyChanged
	{
		
		private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);
		
		private int _Id;
		
		private string _Name;
		
		private System.Nullable<int> _ParentId;
		
		private string _Path;
		
		private EntitySet<Folder> _ChildFolders;
		
		private EntitySet<Image> _Images;
		
		private EntityRef<Folder> _Parent;
		
    #region Extensibility Method Definitions
    partial void OnLoaded();
    partial void OnValidate(System.Data.Linq.ChangeAction action);
    partial void OnCreated();
    partial void OnIdChanging(int value);
    partial void OnIdChanged();
    partial void OnNameChanging(string value);
    partial void OnNameChanged();
    partial void OnParentIdChanging(System.Nullable<int> value);
    partial void OnParentIdChanged();
    partial void OnPathChanging(string value);
    partial void OnPathChanged();
    #endregion
		
		public Folder()
		{
			this._ChildFolders = new EntitySet<Folder>(new Action<Folder>(this.attach_ChildFolders), new Action<Folder>(this.detach_ChildFolders));
			this._Images = new EntitySet<Image>(new Action<Image>(this.attach_Images), new Action<Image>(this.detach_Images));
			this._Parent = default(EntityRef<Folder>);
			OnCreated();
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Id", AutoSync=AutoSync.OnInsert, DbType="Int NOT NULL IDENTITY", IsPrimaryKey=true, IsDbGenerated=true)]
		public int Id
		{
			get
			{
				return this._Id;
			}
			set
			{
				if ((this._Id != value))
				{
					this.OnIdChanging(value);
					this.SendPropertyChanging();
					this._Id = value;
					this.SendPropertyChanged("Id");
					this.OnIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Name", DbType="NVarChar(MAX) NOT NULL", CanBeNull=false)]
		public string Name
		{
			get
			{
				return this._Name;
			}
			set
			{
				if ((this._Name != value))
				{
					this.OnNameChanging(value);
					this.SendPropertyChanging();
					this._Name = value;
					this.SendPropertyChanged("Name");
					this.OnNameChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_ParentId", DbType="Int")]
		public System.Nullable<int> ParentId
		{
			get
			{
				return this._ParentId;
			}
			set
			{
				if ((this._ParentId != value))
				{
					if (this._Parent.HasLoadedOrAssignedValue)
					{
						throw new System.Data.Linq.ForeignKeyReferenceAlreadyHasValueException();
					}
					this.OnParentIdChanging(value);
					this.SendPropertyChanging();
					this._ParentId = value;
					this.SendPropertyChanged("ParentId");
					this.OnParentIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Path", DbType="NVarChar(MAX) NOT NULL", CanBeNull=false)]
		public string Path
		{
			get
			{
				return this._Path;
			}
			set
			{
				if ((this._Path != value))
				{
					this.OnPathChanging(value);
					this.SendPropertyChanging();
					this._Path = value;
					this.SendPropertyChanged("Path");
					this.OnPathChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.AssociationAttribute(Name="Folder_Folder", Storage="_ChildFolders", ThisKey="Id", OtherKey="ParentId")]
		public EntitySet<Folder> ChildFolders
		{
			get
			{
				return this._ChildFolders;
			}
			set
			{
				this._ChildFolders.Assign(value);
			}
		}
		
		[global::System.Data.Linq.Mapping.AssociationAttribute(Name="Folder_Image", Storage="_Images", ThisKey="Id", OtherKey="FolderId")]
		public EntitySet<Image> Images
		{
			get
			{
				return this._Images;
			}
			set
			{
				this._Images.Assign(value);
			}
		}
		
		[global::System.Data.Linq.Mapping.AssociationAttribute(Name="Folder_Folder", Storage="_Parent", ThisKey="ParentId", OtherKey="Id", IsForeignKey=true)]
		public Folder Parent
		{
			get
			{
				return this._Parent.Entity;
			}
			set
			{
				Folder previousValue = this._Parent.Entity;
				if (((previousValue != value) 
							|| (this._Parent.HasLoadedOrAssignedValue == false)))
				{
					this.SendPropertyChanging();
					if ((previousValue != null))
					{
						this._Parent.Entity = null;
						previousValue.ChildFolders.Remove(this);
					}
					this._Parent.Entity = value;
					if ((value != null))
					{
						value.ChildFolders.Add(this);
						this._ParentId = value.Id;
					}
					else
					{
						this._ParentId = default(Nullable<int>);
					}
					this.SendPropertyChanged("Parent");
				}
			}
		}
		
		public event PropertyChangingEventHandler PropertyChanging;
		
		public event PropertyChangedEventHandler PropertyChanged;
		
		protected virtual void SendPropertyChanging()
		{
			if ((this.PropertyChanging != null))
			{
				this.PropertyChanging(this, emptyChangingEventArgs);
			}
		}
		
		protected virtual void SendPropertyChanged(String propertyName)
		{
			if ((this.PropertyChanged != null))
			{
				this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
			}
		}
		
		private void attach_ChildFolders(Folder entity)
		{
			this.SendPropertyChanging();
			entity.Parent = this;
		}
		
		private void detach_ChildFolders(Folder entity)
		{
			this.SendPropertyChanging();
			entity.Parent = null;
		}
		
		private void attach_Images(Image entity)
		{
			this.SendPropertyChanging();
			entity.Folder = this;
		}
		
		private void detach_Images(Image entity)
		{
			this.SendPropertyChanging();
			entity.Folder = null;
		}
	}
	
	[global::System.Data.Linq.Mapping.TableAttribute(Name="dbo.Images")]
	public partial class Image : INotifyPropertyChanging, INotifyPropertyChanged
	{
		
		private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);
		
		private int _Id;
		
		private string _Name;
		
		private System.Data.Linq.Binary _Data;
		
		private int _FolderId;
		
		private EntityRef<Folder> _Folder;
		
    #region Extensibility Method Definitions
    partial void OnLoaded();
    partial void OnValidate(System.Data.Linq.ChangeAction action);
    partial void OnCreated();
    partial void OnIdChanging(int value);
    partial void OnIdChanged();
    partial void OnNameChanging(string value);
    partial void OnNameChanged();
    partial void OnDataChanging(System.Data.Linq.Binary value);
    partial void OnDataChanged();
    partial void OnFolderIdChanging(int value);
    partial void OnFolderIdChanged();
    #endregion
		
		public Image()
		{
			this._Folder = default(EntityRef<Folder>);
			OnCreated();
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Id", AutoSync=AutoSync.OnInsert, DbType="Int NOT NULL IDENTITY", IsPrimaryKey=true, IsDbGenerated=true)]
		public int Id
		{
			get
			{
				return this._Id;
			}
			set
			{
				if ((this._Id != value))
				{
					this.OnIdChanging(value);
					this.SendPropertyChanging();
					this._Id = value;
					this.SendPropertyChanged("Id");
					this.OnIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Name", DbType="NVarChar(MAX) NOT NULL", CanBeNull=false)]
		public string Name
		{
			get
			{
				return this._Name;
			}
			set
			{
				if ((this._Name != value))
				{
					this.OnNameChanging(value);
					this.SendPropertyChanging();
					this._Name = value;
					this.SendPropertyChanged("Name");
					this.OnNameChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Name="Image", Storage="_Data", DbType="VarBinary(MAX) NOT NULL", CanBeNull=false, UpdateCheck=UpdateCheck.Never)]
		public System.Data.Linq.Binary Data
		{
			get
			{
				return this._Data;
			}
			set
			{
				if ((this._Data != value))
				{
					this.OnDataChanging(value);
					this.SendPropertyChanging();
					this._Data = value;
					this.SendPropertyChanged("Data");
					this.OnDataChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_FolderId", DbType="Int NOT NULL")]
		public int FolderId
		{
			get
			{
				return this._FolderId;
			}
			set
			{
				if ((this._FolderId != value))
				{
					if (this._Folder.HasLoadedOrAssignedValue)
					{
						throw new System.Data.Linq.ForeignKeyReferenceAlreadyHasValueException();
					}
					this.OnFolderIdChanging(value);
					this.SendPropertyChanging();
					this._FolderId = value;
					this.SendPropertyChanged("FolderId");
					this.OnFolderIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.AssociationAttribute(Name="Folder_Image", Storage="_Folder", ThisKey="FolderId", OtherKey="Id", IsForeignKey=true, DeleteOnNull=true, DeleteRule="CASCADE")]
		public Folder Folder
		{
			get
			{
				return this._Folder.Entity;
			}
			set
			{
				Folder previousValue = this._Folder.Entity;
				if (((previousValue != value) 
							|| (this._Folder.HasLoadedOrAssignedValue == false)))
				{
					this.SendPropertyChanging();
					if ((previousValue != null))
					{
						this._Folder.Entity = null;
						previousValue.Images.Remove(this);
					}
					this._Folder.Entity = value;
					if ((value != null))
					{
						value.Images.Add(this);
						this._FolderId = value.Id;
					}
					else
					{
						this._FolderId = default(int);
					}
					this.SendPropertyChanged("Folder");
				}
			}
		}
		
		public event PropertyChangingEventHandler PropertyChanging;
		
		public event PropertyChangedEventHandler PropertyChanged;
		
		protected virtual void SendPropertyChanging()
		{
			if ((this.PropertyChanging != null))
			{
				this.PropertyChanging(this, emptyChangingEventArgs);
			}
		}
		
		protected virtual void SendPropertyChanged(String propertyName)
		{
			if ((this.PropertyChanged != null))
			{
				this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
			}
		}
	}
}
#pragma warning restore 1591
