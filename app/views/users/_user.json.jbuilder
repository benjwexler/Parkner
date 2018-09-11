json.extract! user, :id, :first_name, :last_name, :phone_number, :email, :password, :created_at, :updated_at
json.url user_url(user, format: :json)
