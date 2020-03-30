# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_28_054356) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "citations", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "post_id"
    t.json "body"
    t.text "title"
    t.text "authors"
    t.string "imprint_date"
    t.string "imprint_type"
    t.string "target"
    t.string "publisher"
    t.integer "generated_post_id"
    t.index ["post_id"], name: "index_citations_on_post_id"
  end

  create_table "follows", force: :cascade do |t|
    t.integer "follower_id", null: false
    t.integer "following_id", null: false
    t.string "follower_type"
    t.string "following_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["follower_id", "following_id", "follower_type", "following_type"], name: "follows_unique_index", unique: true
  end

  create_table "posts", force: :cascade do |t|
    t.text "title"
    t.json "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.string "publisher"
    t.text "authors"
    t.datetime "publish_date"
    t.text "abstract"
    t.integer "user_id"
    t.jsonb "plugins", default: "{}", null: false
    t.string "imprint_date"
    t.string "imprint_type"
    t.datetime "published_at"
    t.integer "visibility", default: 0, null: false
    t.datetime "deleted_at"
    t.index ["slug"], name: "index_posts_on_slug", unique: true
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "title"
    t.string "munged_title"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string "text"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "taggable_id"
    t.string "taggable_type"
    t.string "color"
  end

  create_table "upload_figures", force: :cascade do |t|
    t.integer "upload_id"
    t.text "caption"
    t.string "name"
    t.integer "page"
    t.string "figure_type"
    t.integer "width"
    t.integer "height"
    t.string "index"
    t.text "image_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["figure_type"], name: "index_upload_figures_on_figure_type"
    t.index ["upload_id"], name: "index_upload_figures_on_upload_id"
  end

  create_table "upload_teis", force: :cascade do |t|
    t.integer "upload_id"
    t.jsonb "body"
    t.jsonb "header"
    t.jsonb "references"
    t.index ["upload_id"], name: "index_upload_teis_on_upload_id"
  end

  create_table "uploads", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "file_data"
    t.integer "post_id"
    t.integer "user_id"
    t.index ["post_id"], name: "index_uploads_on_post_id"
    t.index ["user_id"], name: "index_uploads_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "username", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.boolean "admin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.text "avatar_data"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
