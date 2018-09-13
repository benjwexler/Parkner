Rails.application.routes.draw do
  devise_for :users
  get 'home/index'
  resources :parkings
  resources :cars
  resources :users
  # "home#index"

  authenticated do 
    root :to => 'home#index'
  end
  root :to => 'home#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
