---
title: "OBD1 Check Engine Light Codes"
date: 2024-05-04
type: post
category: "Honda Info and DIYs"
---

Pulling CEL codes for an OBD1 Honda is actually pretty easy. All you need to do is locate the service connector (a 2 pin connector usually behind the glove box) and jump it. Then when the key is set to IGN the check engine light will start blinking.

Long blinks are 10, and short blinks are 1.

For example, code 22 (VTEC pressure switch) would look like: long blink - long blink - short blink - short blink

| Code | Description                             |
| ---- | --------------------------------------- |
| 0    | Engine Control Module (ECM)             |
| 1    | Heated Oxygen Sensor (H02S)             |
| 3    | Manifold Absolute Pressure (MAP Sensor) |
| 4    | Crankshaft Position (CKP Sensor)        |
| 6    | Engine Coolant Temperature (ECT Sensor) |
| 7    | Throttle Position (TP Sensor)           |
| 8    | Top Dead Center Position (TDC Sensor)   |
| 9    | No. 1 Cylinder Position (CYP Sensor)    |
| 10   | Intake Air Temperature (IAT Sensor)     |
| 11   | Engine Overheating\*\*                  |
| 13   | Barometric Pressure (BARO Sensor)       |
| 14   | Idle Air Control (IAC Valve)            |
| 15   | Ignition Output Signal                  |
| 16   | Fuel Injector                           |
| 17   | Vehicle Speed Sensor (VSS)              |
| 20   | Electrical Load Detector (ELD)          |
| 21   | VTEC Solenoid                           |
| 22   | VTEC Pressure Switch                    |
| 23   | Knock Sensor (KS)                       |
| 30   | AT FI Signal A                          |
| 31   | AT FI Signal B                          |
| 41   | Heated Oxygen Sensor (H02S) Heater      |
| 43   | Fuel Supply System                      |

\*\* Code 11 is Hondata S300 specific and doesn't apply to stock Honda ECUs. Hondata sets it to activate if coolant temp goes above 212F by default.

# References

These codes were taken from the 94-01 service manual. I cross referenced them against the 92 - 95 Civic service manual, and 97 - 01 CRV service manual.
