class EmailMailer < ApplicationMailer
    default from: 'parknerappnycda@gmail.com'

    def signup_email(user)
        @user = user
        mail(to: @user.email, subject: 'Thanks for Signing Up for Parkner')
    end

    def parked_email(user)
        @user = user
        mail(to: @user.email, subject: 'Thanks for Parking with Parkner!')
    end

    def reminder_email(user)
        @user = user
        mail(to: @user.email, subject: 'Your Parkner Reminder is Set!')
    end

    def parked_email2(user, parking)
        @user = user
        @parking = parking
        mail(to: @user.email, subject: 'Your Parkner Reminder is Set!')
    end

    def deliverLater(user, parking)
        @user = user
        @parking = parking
        mail(to: @user.email, subject: 'You will receive this 2 min after you parked!')
    end


end
