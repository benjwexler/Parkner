class ParkingsController < ApplicationController
  before_action :set_parking, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  # GET /parkings
  # GET /parkings.json
  def index
    # @parkings = Parking.all
    @parkings = User.find(current_user.id).parkings
     @user_has_no_parkings = User.find(current_user.id).parkings == [];
    @user = current_user
     p @user_has_no_parkings

     
  end

  # GET /parkings/1
  # GET /parkings/1.json
  def show
    if Parking.exists?(params[:id].to_i) && Parking.find(params[:id].to_i).user_id == current_user.id

    else
      redirect_to "/parkings"
    end 

    p params[:id].to_i 
  end

  # GET /parkings/new
  def new
    @parking = Parking.new
    @current_user = current_user.id
    @cars = User.find(current_user).cars
    @user_parkings = User.find(@current_user).parkings

    @current_cars_parked = []

    @user_parkings.each do |parking_session|
      @current_cars_parked.push(parking_session.car_id)
    end 

   
  end

  # GET /parkings/1/edit
  def edit

    redirect_to "/parkings"

    @current_user = current_user.id
    @cars = User.find(current_user).cars
    @user_parkings = User.find(@current_user).parkings

    @current_cars_parked = []

    @user_parkings.each do |parking_session|
      @current_cars_parked.push(parking_session.car_id)
    end 

    
  end

  # POST /parkings
  # POST /parkings.json
  def create

    @user = current_user

    hours_until_reminder = false
  
    if parking_params[:move_by].length > 0

      mins = parking_params[:minutes_before]
    

      move_by_date_string = parking_params[:move_by] #<---move by parameter
      move_by_datetime_object = DateTime.parse(move_by_date_string)

      right_now_datetime_object = DateTime.now
      
      hours_until_move_by_date = (move_by_datetime_object - right_now_datetime_object) * 24.0

      hours_until_reminder = hours_until_move_by_date - (mins.to_i/60)



      @parking = Parking.new(parking_params.except(:minutes_before))
      puts "----------------------"
      puts "----------------------"
      puts "----------------------"
      puts "----------------------"
      puts "MOVE BY DATE"
      puts  move_by_datetime_object
      puts "REMINDER SET FOR #{mins} MINS BEFORE MOVE BY DATE"
      puts (DateTime.parse(parking_params[:move_by]) - (mins.to_i).minutes)
      puts "HOURS UNTIL REMINDER"
      puts hours_until_reminder
      puts "----------------------"
      puts "----------------------"
      puts "----------------------"
      @parking.update(remind_at: (DateTime.parse(parking_params[:move_by]) - (mins.to_i).minutes))

    else
      @parking = Parking.new(parking_params.except(:minutes_before))
    end


    respond_to do |format|
      if @parking.save


        puts "----------------------"
        puts "----------------------"
        puts "----------------------"
        puts "----------------------"
        puts "----------------------"
        puts "----------------------"
        puts @parking.inspect
        puts "----------------------"
        puts "----------------------"
        puts "----------------------"  
        puts "----------------------"
        puts "----------------------"
     

        EmailMailer.parked_email(@user).deliver
        EmailMailer.parked_email2(@user, @parking).deliver

        if hours_until_reminder == false
          
        else
          EmailMailer.reminder_email(@user).deliver_later(wait: hours_until_reminder.hours)
        end

        format.html { redirect_to @parking, notice: 'Parking was successfully created.' }
        format.json { render :show, status: :created, location: @parking }
      else
        format.html { render :new }
        format.json { render json: @parking.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parkings/1
  # PATCH/PUT /parkings/1.json
  def update
    respond_to do |format|
      if @parking.update(parking_params)
        format.html { redirect_to @parking, notice: 'Parking was successfully updated.' }
        format.json { render :show, status: :ok, location: @parking }
      else
        format.html { render :edit }
        format.json { render json: @parking.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parkings/1
  # DELETE /parkings/1.json
  def destroy
    @parking.destroy
    respond_to do |format|
      format.html { redirect_to parkings_url, notice: 'Parking was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_parking
  
      if Parking.exists?(params[:id].to_i)
        @parking = Parking.find(params[:id])
      else
        redirect_to "/parkings"
      end 
     

    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def parking_params
      params.require(:parking).permit(:user_id, :car_id, :active, :address, :start_lat, :end_lat, :start_long, :end_long, :move_by, :remind_at, :minutes_before)
    end
end
