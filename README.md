# Welcome to your Expo app 👋

version 3.1




employee

1) check in and checkout error fixes


when i looged in using the credentials and starts the geo in , it sdtarts the timer for that particular user same according to the other user

the issue is that , when i ligged out , then the tgimer all data gets deleted for that user 
files to deeply analyze and study 

attendanceService.js
AuthContext.js


apis: 


Post: api/attendance/geo-checkin


{
  "latitude": 18.5204,
  "longitude": 73.8567,
  "accuracy": 15
}




·        Response :
{
  "message": "Geo check-in successful"
}



> post: api/attendance/geo-checkout 


{
            "latitude": 18.5204,
       	 "longitude": 73.8567,
            "accuracy": 15
     	} 
·        Response :
{
    "message": "Checked Out successful "
}



to deeply analyze and study the files 
CorrectionRequests.cshtml
EmployeeSummary.cshtml
RequestCorrection.cshtml

token generate like this :                    string token = null;
                    if (!isHr || canResolve)
                    {
                        token = UrlEncryptionHelper.GenerateToken(
                        a.Emp_Code,
                        a.Date,
                        expiryMinutes: 30
                        );
                    }





AttendanceController.cs

EmployeeSummary.html

EmployeePanel.html

RequestCorrection.html

AttendanceService.cs







2) 

Attendance Summary — MADHAV ANGAD MORE (IA00117)


there is table 


columns: 
Date	Check In	Check Out	Working Hours	Status	Correction


in this when user click on the corerction -request 

it should open a popup form 

9.Attendance correction request get -> get: http://192.168.1.75:5000/api/Attendance/correction-request?token=wHFYl9zkWYjlSabErgketx7OhbDI03SHrphUZcA6zRapGLqiYXgaMJwCmjbHuhUTIFMKY6SM7YXsohMhFMd-og&employeeId=106


the toke is generated using 






token generate like this :                    string token = null;
                    if (!isHr || canResolve)
                    {
                        token = UrlEncryptionHelper.GenerateToken(
                        a.Emp_Code,
                        a.Date,
                        expiryMinutes: 30
                        );
                    }


in backend response we get :


{
    "employee": {
        "id": 106,
        "name": "BHAGYSHREE MORE",
        "employeeCode": "IA00087",
        "role": "Employee"
    },
    "attendance": {
        "date": "2026-02-03T00:00:00",
        "inTime": null,
        "outTime": null,
        "status": "A",
        "correctionRequested": false,
        "correctionStatus": "None"
    },
    "token": "wHFYl9zkWYjlSabErgketx7OhbDI03SHrphUZcA6zRapGLqiYXgaMJwCmjbHuhUTIFMKY6SM7YXsohMhFMd-og"
}


then

8.Attendance in correction request submit  -> post :api/Attendance/correction-request
   AttendanceController.cs

in form data we have to 

pass : token 
correctionRequest 
proofFile

    return Ok(new
    {
        success = true,
        message = "Correction request submitted successfully"
    });






Attendance Summary user side ->get: api/Attendance/my-summary

.Response : 
{
    "employee": {
        "id": 110,
        "name": "VANITA SARKATE",
        "employeeCode": "IA00091"
    },
    "records": [
        {
            "date": "2026-02-12T00:00:00",
            "inTime": "10:30",
            "outTime": null,
            "workingHours": "--",
            "status": "P",
            "correctionStatus": "None",
            "token": "wHFYl9zkWYjlSabErgketwdXAeSxa5FjZWISWhLVY6MJDWkxcIRCTwS7Pvqdjo8XumbHZWXeM4NgujQ9BemU_g"
        }
    ]
}


6.Attendance Summary hr side ->get:                      api/Attendance/employee-summary/106


{
    "employee": {
        "id": 106,
        "name": "BHAGYSHREE MORE",
        "employeeCode": "IA00087",
        "role": "Employee"
    },
    "fromDate": "2026-02-01T00:00:00",
    "toDate": "2026-02-12T00:00:00+05:30",
    "records": [
        {
            "date": "2026-02-12T00:00:00",
            "inTime": null,
            "outTime": null,
            "workingHours": "--",
            "status": "A",
            "correctionStatus": "None",
            "token": "wHFYl9zkWYjlSabErgketx7OhbDI03SHrphUZcA6zRYQVZwB0_PaLGHH8Sk5SBda6Ya8lh4p8-pNkPWbTAWS4w"
        },
          ]
}




==============================================================================================================================================================================








leave managemenrt





LEAVES_________________________________>

1) apply leaves

2) my leaves



appleaves
files to study



. APPLY LEAVE API POST -> /api/Leave

{
  "category": 0,
  "leaveType": "FullDay",
  "startDate": "2026-02-21",
  "endDate": "2026-02-22",
  "timeValue": null,
  "reason": "Personal work"
}

.RESPONSE


{
    "message": "Leave applied successfully",
    "id": 1130
}



16.MONTHLY SUMMARY get ->/api/Leave/monthly-summary?year=2026

.RESPONSE
[
    {
        "month": 1,
        "count": 29
    }
]


17. STATUS SUMMARY GET -> api/Leave/status-summary

.RESPONSE
[
    {
        "status": "Approved",
        "count": 66
    },
    {
        "status": "Cancelled",
        "count": 1
    },
    {
        "status": "Rejected",
        "count": 36
    }
]




0. User all Leaves  get ->/api/Leave/my
.response
[
    {
        "id": 126,
        "category": 1,
        "startDate": "2026-01-23T00:00:00",
        "endDate": "2026-01-23T00:00:00",
        "totalDays": 1,
        "overallStatus": "Approved",
        "reason": "test"
    },
    {
        "id": 119,
        "category": 1,
        "startDate": "2026-01-10T00:00:00",
        "endDate": "2026-01-10T00:00:00",
        "totalDays": 1,
        "overallStatus": "Rejected",
        "reason": "test"
    },
    {
        "id": 103,
        "category": 3,
        "startDate": "2025-12-31T00:00:00",
        "endDate": "2025-12-31T00:00:00",
        "totalDays": 1,
        "overallStatus": "Rejected",
        "reason": "Test"
    },
   







    },


    
20. GET EMPLOYEE BY ID GET -> api/employees/20

.RESPONSE 
{
    "id": 20,
    "employeeCode": "IA00001",
    "name": "RAHUL ASHOK KANGANE",
    "email": "kangane.rahul@gmail.com",
    "mobileNumber": "9004749899",
    "alternateMobileNumber": "8956554833",
    "password": "123456",
    "confirmPassword": null,
    "gender": "Male",
    "fatherName": "ASHOK",
    "motherName": "VIMAL",
    "doB_Date": "1988-04-26T00:00:00",
    "maritalStatus": "Married",
    "experienceType": "Experienced",
    "totalExperienceYears": 0,
    "experienceCertificateFilePath": "-",
    "lastCompanyName": "-",
    "joiningDate": "2025-03-03T00:00:00",
    "department": "DIRECTOR",
    "position": "Director",
    "salary": 200000.00,
    "reportingManager": "abc",
    "managerId": 36,
    "role": "Director",
    "address": "602 MADHAVACHAYA MORDEN COLONY SHIVAJI NAGAR PUNE 411016",
    "permanentAddress": "602 MADHAVACHAYA MORDEN COLONY SHIVAJI NAGAR PUNE 411016",
    "hscPercent": 58.00,
    "graduationCourse": "BCA",
    "graduationPercent": 78.00,
    "postGraduationCourse": "None",
    "postGraduationPercent": 56.00,
    "aadhaarNumber": "712145802350",
    "panNumber": "CGEPK7155G",
    "accountHolderName": "-",
    "bankName": "-",
    "accountNumber": "-",
    "ifsc": "0",
    "branch": "-",
    "profileImagePath": "-",
    "aadhaarFilePath": "-",
    "panFilePath": "-",
    "passbookFilePath": "-",
    "tenthMarksheetFilePath": "-",
    "twelfthMarksheetFilePath": "-",
    "graduationMarksheetFilePath": "-",
    "postGraduationMarksheetFilePath": "-",
    "medicalDocumentFilePath": "-",
    "emergencyContactName": "KANCHAN RAHUL KANGANE ",
    "emergencyContactRelationship": "SPOUSE",
    "emergencyContactMobile": "8369066147",
    "emergencyContactAddress": "SAME AS ABOVE",
    "hasDisease": "No",
    "diseaseName": "-",
    "diseaseType": "-",
    "diseaseSince": "-",
    "medicinesRequired": "-",
    "doctorName": "-",
    "doctorContact": "-",
    "lastAffectedDate": "-",
    "createdAt": "2025-11-20T12:09:09.697",
    "status": "Active",
    "deactiveReason": null,
    "compOffBalance": 0,
    "lastCompOffEarnedDate": null,
    "passwordHash": null,
    "failedLoginAttempts": 1,
    "lockoutEndUtc": "2026-01-16T11:24:03.0203642"
}












































































