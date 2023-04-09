#include <Wire.h>
#include "Adafruit_TCS34725.h"

#include "Adafruit_VEML6070.h"

#include <SparkFunCCS811.h>

#define CCS811_ADDR 0x5B //Default I2C Address
//#define CCS811_ADDR 0x5A //Alternate I2C Address

CCS811 myCCS811(CCS811_ADDR);

Adafruit_VEML6070 uv = Adafruit_VEML6070();

/* Example code for the Adafruit TCS34725 breakout library */

/* Connect SCL    to analog 5
   Connect SDA    to analog 4
   Connect VDD    to 3.3V DC
   Connect GROUND to common ground */

/* Initialise with default values (int time = 2.4ms, gain = 1x) */
// Adafruit_TCS34725 tcs = Adafruit_TCS34725();

/* Initialise with specific int time and gain values */
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);

void setup(void) {
  Serial.begin(9600);

  if (tcs.begin()) {
    Serial.println("Found sensor");
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1);
  }
uv.begin(VEML6070_1_T);  // pass in the integration time constant

myCCS811.begin();
  // Now we're ready to get readings!
}

void loop(void) {
  uint16_t r, g, b, c, colorTemp, lux;

  tcs.getRawData(&r, &g, &b, &c);
  // colorTemp = tcs.calculateColorTemperature(r, g, b);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);

  Serial.println("TCS data begin ...");
  Serial.print("Color Temp: "); Serial.print(colorTemp, DEC); Serial.print(" K - ");
  Serial.print("Lux: "); Serial.print(lux, DEC); Serial.print(" - ");
  Serial.print("R: "); Serial.print(r, DEC); Serial.print(" ");
  Serial.print("G: "); Serial.print(g, DEC); Serial.print(" ");
  Serial.print("B: "); Serial.print(b, DEC); Serial.print(" ");
  Serial.print("C: "); Serial.print(c, DEC); Serial.print(" ");
  Serial.println("TCS data end ");

Serial.println("VEML data begin ...");
    Serial.print("UV light level: "); Serial.println(uv.readUV());
Serial.println("VEML data end ");


  if (myCCS811.dataAvailable())
  {
    myCCS811.readAlgorithmResults();
    Serial.println("CCS811 data begin ...");
    Serial.print("CO2[");
    //Returns calculated CO2 reading
    Serial.print(myCCS811.getCO2());
    Serial.print("] tVOC[");
    //Returns calculated TVOC reading
    Serial.println(myCCS811.getTVOC());
    Serial.println("CCS811 data end ");

    
  }
  else if (myCCS811.checkForStatusError())
  {
    while(1);
  }
  
  delay(1500);
}
