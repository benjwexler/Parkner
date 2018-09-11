class Car < ApplicationRecord
    belongs_to :user
    has_many :parkings, dependent: :destroy
    
end
