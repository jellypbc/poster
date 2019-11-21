require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/google_cloud_storage"

if Rails.env.development?
	Shrine.storages = { 
	  cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
	  store: Shrine::Storage::FileSystem.new("public", prefix: "uploads"), 
	}

elsif Rails.env.staging? || Rails.env.production?
	Shrine.storages = {
	  cache: Shrine::Storage::GoogleCloudStorage.new(bucket: "jellyposter-cache"),
	  store: Shrine::Storage::GoogleCloudStorage.new(
	  	bucket: "jellyposter-store",
		  default_acl: 'publicRead',
		  object_options: {
	 	   cache_control: 'public, max-age: 7200'
  		}
  	)
	}
end
 
Shrine.plugin :activerecord # or :activerecord 
Shrine.plugin :cached_attachment_data # for retaining the cached file across form redisplays 
Shrine.plugin :restore_cached_data # re-extract metadata when attaching a cached file 

Shrine.plugin :upload_endpoint
Shrine.plugin :presign_endpoint
Shrine.plugin :download_endpoint