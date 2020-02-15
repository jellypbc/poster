require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/google_cloud_storage"

if Rails.env.development? || Rails.env.test?
	Shrine.storages = {
	  cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
	  store: Shrine::Storage::FileSystem.new("public", prefix: "uploads"),
	}
elsif Rails.env.production?
	Shrine.storages = {
	  cache: Shrine::Storage::GoogleCloudStorage.new(
	  	bucket: "jellyposter-cache",
		  default_acl: 'publicRead',
		  object_options: {
	 	   cache_control: 'public, max-age: 7200'
  		}
  	),
	  store: Shrine::Storage::GoogleCloudStorage.new(
	  	bucket: "jellyposter-store",
		  default_acl: 'publicRead',
		  object_options: {
	 	   cache_control: 'public, max-age: 7200'
  		}
  	)
	}
end

Shrine.logger = Rails.logger

# Provides ActiveRecord integration, adding callbacks and validations.
Shrine.plugin :activerecord
# Automatically logs processing, storing and deleting, with a configurable format.
Shrine.plugin :instrumentation
# for retaining the cached file across form redisplays
Shrine.plugin :cached_attachment_data
# re-extract metadata when attaching a cached file
Shrine.plugin :restore_cached_data
# The determine_mime_type plugin allows you to determine and store the actual MIME type of the file analyzed from file content.
Shrine.plugin :determine_mime_type, analyzer: :mimemagic
# The pretty_location plugin attempts to generate a nicer folder structure for uploaded files.
Shrine.plugin :pretty_location
# Image versions service
Shrine.plugin :derivatives
# Use fallback urls for image derivatives
Shrine.plugin :default_url

Shrine.plugin :remote_url, max_size: 20*1024*1024
Shrine.plugin :presign_endpoint
Shrine.plugin :upload_endpoint, url: true
Shrine.plugin :download_endpoint
