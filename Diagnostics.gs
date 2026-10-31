function backupDatabase(){var id=PropertiesService.getScriptProperties().getProperty('DB_ID');if(!id)throw new Error('Run setupDatabase() first.');var f=DriveApp.getFileById(id),stamp=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyyMMdd-HHmmss'),copy=f.makeCopy('Exam-Saathi-DB-Backup-'+stamp);return copy.getUrl();}
function runDiagnostics(){var ss=db_(),issues=[],summary={};Object.keys(SCHEMA).forEach(function(n){var sh=ss.getSheetByName(n);if(!sh){issues.push('Missing sheet: '+n);return;}var got=sh.getRange(1,1,1,SCHEMA[n].length).getValues()[0];if(SCHEMA[n].some(function(h,i){return got[i]!==h;}))issues.push('Header mismatch: '+n);summary[n]=Math.max(0,sh.getLastRow()-1);});var users=rows_('Users'),emails={};users.forEach(function(u){var e=u.Email.toLowerCase();if(e&&emails[e])issues.push('Duplicate account email: '+e);emails[e]=true;});rows_('Routes').forEach(function(r){if(!rows_('ExamCenters').some(function(c){return c.ID===r.CentreID;}))issues.push('Route has invalid centre: '+r.ID);});rows_('Vehicles').forEach(function(v){if(Number(v.Capacity)<1||Number(v.Capacity)>20)issues.push('Invalid vehicle capacity: '+v.ID);});return{ok:issues.length===0,counts:summary,issues:issues};}
function testDatabaseSetup(){var r=runDiagnostics();if(!r.ok)throw new Error(r.issues.join('\n'));return 'Database diagnostics passed.';}
function testBookingCapacityRules(){var vehicles=rows_('Vehicles'),bad=vehicles.filter(function(v){return !isFinite(Number(v.Capacity))||Number(v.Capacity)<1||Number(v.Capacity)>20;});if(bad.length)throw new Error('Invalid capacity in '+bad.map(function(v){return v.ID;}).join(', '));return 'Vehicle capacity data checks passed. Assignment endpoint independently enforces capacity under LockService.';}

function testAuthenticationGuards(){
  var checks=0;
  try{session_({},['ADMIN']);throw new Error('Unauthenticated admin access was accepted.');}catch(e){if(e.message==='Unauthenticated admin access was accepted.')throw e;checks++;}
  try{session_({token:'invalid-token'},['STUDENT']);throw new Error('Invalid session token was accepted.');}catch(e){if(e.message==='Invalid session token was accepted.')throw e;checks++;}
  return 'Authentication guard checks passed: '+checks;
}
function testInputValidationHelpers(){
  if(!validEmail_('test@example.com'))throw new Error('Valid email rejected.');
  if(validEmail_('not-an-email'))throw new Error('Invalid email accepted.');
  if(clean_('  Exam Saathi  ',80)!=='Exam Saathi')throw new Error('Input cleanup failed.');
  if(hashToken_('sample-token')===hashToken_('another-token'))throw new Error('Token hash collision in basic test.');
  return 'Input validation helper checks passed.';
}
