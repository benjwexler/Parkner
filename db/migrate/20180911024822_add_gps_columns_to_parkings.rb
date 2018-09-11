class AddGpsColumnsToParkings < ActiveRecord::Migration[5.2]
  def change
    add_column :parkings, :active, :boolean
    add_column :parkings, :address, :string
    add_column :parkings, :start_lat, :string
    add_column :parkings, :end_lat, :string
    add_column :parkings, :start_long, :string
    add_column :parkings, :end_long, :string
    add_column :parkings, :move_by, :datetime
    add_column :parkings, :remind_at, :datetime
  end
end
