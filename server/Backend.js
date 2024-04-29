(function (root, factory) {
  root.BACKEND = factory();
})(this, function () {

  const { REFERENCES_MANAGER, modulesRequire } = CCLIBRARIES

  const MASTER_INDEX_FILE_ID = "1ohC9kPnMxyptp8SadRBGAofibGiYTTev" // OPEN ACCESS
  const REQUIRED_REFERENCES = ["deployedScripts"]; // OPEN ACCESS

  let referencesObj



  function getFeed() {
    const eventsFeed = getFeedViaAPI()
    augmentParameters(eventsFeed)
    return JSON.stringify({ eventsFeed })
  }

  function getFeedViaAPI() {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.get({
      process: "getEventsFeed"
    });
    return response.eventsFeed
  }

  function augmentParameters() {

  }

  function createEventInfraStructure(request) {
    // Create event docs and infrastructure elements
    // Get Response
    // If success
  }

  function addEventToDB() {
    // Add Event to DB
    // Regenerate Feed
  }

  return {
    getFeed
  }

})

function getFeed() {
  BACKEND.getFeed()
}

function createEventInfraStructure(request) {
  return BACKEND.createEventInfraStructure(request)
}

function addEventToDB(request) {
  return BACKEND.addEventToDB(request)
}
