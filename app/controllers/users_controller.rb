class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  # GET /users
  # GET /users.json
  def index
   
    # redirect_to "/users/#{current_user.id}"
    # @users = User.all
    @user = User.find(current_user.id)
     
  end

  # GET /users/1
  # GET /users/1.json
  def show 
    p params[:id].to_i
    p current_user.id

    p params[:id].to_i == current_user.id

    if User.exists?(params[:id].to_i) && params[:id].to_i == current_user.id 
      @parkings = @user.parkings
      @cars = @user.cars
    else
      redirect_to "/users/#{current_user.id}"
    end 
   
 

  end

  # GET /users/new
  def new
    @user = User.new
    @current_user = current_user.id
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      if User.exists?(params[:id].to_i)
          @user = User.find(params[:id])
      else
        redirect_to "/users/#{current_user.id}"
      end 
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:first_name, :last_name, :phone_number, :email, :password)
    end

    
      
  
end
