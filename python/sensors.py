import time
import adafruit_dht
import board

dht_device = adafruit_dht.DHT11(board.D4, use_pulseio=False)

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO_TRIGGER = 17
GPIO_ECHO = 27

GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

def distance():
    GPIO.output(GPIO_TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    StartTime = time.time()
    StopTime = time.time()

    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time. time()
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    TimeElapsed = StopTime - StartTime
    distance = (TimeElapsed * 34300) / 2
    return distance

if __name__ == '__main__':
    try:
        temp_c = dht_device.temperature
        temp_f = temp_c * (9/5)+32
        humidity = dht_device.humidity
        dist = distance()
        print('{"temp_c":'+str(temp_c)+', "temp_f":'+str(temp_f)+', "humidity":'+str(humidity)+', "distance":'+str(round(dist, 2))+'}')
    except KeyboardInterrupt:
        print("Measurement stopped by User")
        GPIO.cleanup()
    except RuntimeError as err:
        print(err.args[0])
