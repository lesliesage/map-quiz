Rails.application.routes.draw do
  resources :questions
  resources :cities
  resources :games
  get '/topten', to: 'games#top_ten'
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
