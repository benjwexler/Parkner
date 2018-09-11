class CreateCars < ActiveRecord::Migration[5.2]
  def change
    create_table :cars do |t|
      t.string :nickname
      t.string :description
      t.integer :user_id

      t.timestamps
    end
  end
end
