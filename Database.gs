var SCHEMA={
Users:['ID','Name','Email','Mobile','PasswordHash','Salt','Role','Status','CreatedAt','LastLogin'],
Students:['ID','UserID','Name','Mobile','GuardianName','GuardianMobile','Consent','Village','CreatedAt','Status'],
Drivers:['ID','UserID','Name','Mobile','LicenseNumber','VerificationStatus','Status','CreatedAt'],
Vehicles:['ID','DriverID','RegistrationNo','Type','Capacity','InsuranceExpiry','PermitExpiry','FitnessExpiry','VerificationStatus','Status'],
Exams:['ID','Name','ExamDate','ReportingTime','StartTime','EndTime','Deadline','Status'],
ExamCenters:['ID','Name','Address','District','MapsUrl','Contact','Status'],
Routes:['ID','Village','PickupPoint','CentreID','DistanceKm','DurationMin','Fare','Status'],
Bookings:['ID','StudentID','ExamID','CentreID','RouteID','PickupPoint','VehicleFare','CoordinationFee','TotalAmount','Status','TripID','CreatedAt','UpdatedAt','PaymentStatus'],
Trips:['ID','RouteID','ExamID','DriverID','VehicleID','PickupTime','Status','CreatedAt'],
TripStudents:['ID','TripID','BookingID','StudentID','CreatedAt'],
Payments:['ID','BookingID','Amount','Method','Reference','Status','RefundStatus','RecordedBy','CreatedAt'],
Notifications:['ID','UserID','Title','Message','Read','CreatedAt'],
Settings:['Key','Value','UpdatedAt'],
Consent:['ID','StudentID','GuardianName','GuardianMobile','ConsentGiven','RecordedAt'],
AuditLogs:['ID','ActorID','Action','Entity','Detail','CreatedAt']
};
