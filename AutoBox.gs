// Inspiration from http://www.johneday.com/422/time-based-gmail-filters-with-google-apps-script
/*
 * Manually Create the following labels:
 * A1 - Archive after 1 day
 * A3 - Archive after 3 days
 * A7 - Archive after 7 days
 * D1 - Delete after 1 day
 * D3 - Delete after 3 days
 * D7 - Delete after 7 days
 */

function Intialize() {
  return;
}

function Install() {
  ScriptApp.newTrigger("autoLabel").timeBased().everyMinutes(15).create();
  
  ScriptApp.newTrigger("archive1day").timeBased().everyHours(2).create();
  ScriptApp.newTrigger("archive3days").timeBased().everyHours(2).create();
  ScriptApp.newTrigger("archive7days").timeBased().everyHours(2).create();
  
  ScriptApp.newTrigger("delete1day").timeBased().everyHours(2).create();
  ScriptApp.newTrigger("delete3days").timeBased().everyHours(2).create();
  ScriptApp.newTrigger("delete7days").timeBased().everyHours(2).create();
}

function Uninstall() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}

function batchLabel(search, addLabel) {
  var batchSize = 100;
  var threads = GmailApp.search(search);
  var label = GmailApp.getUserLabelByName(addLabel);
  for (j = 0; j < threads.length; j += batchSize) {
    label.addToThreads(threads.slice(j, j+batchSize));
  }
}

function batchArchive(label, day) {
  var batchSize = 100;
  var threads = GmailApp.search('label:' + label + ' older_than:' + day + 'd');
  for (j = 0; j < threads.length; j += batchSize) {
    GmailApp.moveThreadsToArchive(threads.slice(j, j+batchSize));
  }
  var label = GmailApp.getUserLabelByName(label);
  for (j = 0; j < threads.length; j += batchSize) {
    label.removeFromThreads(threads.slice(j, j+batchSize));
  }
}

function batchDelete(label, day) {
  var batchSize = 100;
  var threads = GmailApp.search('label:' + label + ' older_than:' + day + 'd');
  for (j = 0; j < threads.length; j += batchSize) {
    GmailApp.moveThreadsToTrash(threads.slice(j, j+batchSize));
  }
}

function autoLabel() {
  batchLabel('label:inbox -label:A1 label:Receipts', 'A1');
  batchLabel('label:inbox -label:A1 label:social', 'A1');
  batchLabel('label:inbox -label:A1 label:Social-Connect', 'A1');
  batchLabel('label:inbox -label:A1 label:newsletters', 'A1'); 
  batchLabel('label:inbox -label:A1 label:remote-and-engaged', 'A1');
}

// Only run Tuesday (2) through Friday (5)
function canIRunToday() {
  var dow = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "u");
  return ( dow >= 2 && dow <= 5 );
}

function archive1day() {
  if ( !canIRunToday() ) {
    return;
  }
  batchArchive('A1', 1);
}
function archive3days() {
  if ( !canIRunToday() ) {
    return;
  }
  batchArchive('A3', 3);
}
function archive7days() {
  batchArchive('A7', 7);
}

function delete1day() {
  if ( !canIRunToday() ) {
    return;
  }
  batchDelete('D1', 1);
}
function delete3days() {
  if ( !canIRunToday() ) {
    return;
  }
  batchDelete('D3', 3);
}
function delete7days() {
  batchDelete('D7', 7);
}
