const zephyrPosterOptions = {
  authToken: 'Y2hpbmNob206QWRtaW44ODg=',
  projectKey: 'ONAR',
  postResultsToZephyr: true,
  tagFormat: '@TC-',
};
const formatOptions = ` --format-options '${JSON.stringify(zephyrPosterOptions)}'`;
module.exports = {
  'zephyr-cucumber': `${formatOptions}`,
};
