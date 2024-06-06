const parseCommitMessage = require('./../functions/parseCommitMessage')
const Logger = require('./../functions/logger')

function validateFindOrCreateExtData(taskData) {
  
  if (!taskData.externalServiceName) {
    throw new Error('No externalServiceName')
  }
  
  if (!taskData.message || taskData.message.length > 255) {
    throw new Error('Message is required and must be less than or equal to 255 characters.')
  }

  const commitMessageObj = parseCommitMessage(taskData.message)
  const [taskProject, num] = commitMessageObj.taskId?.split('-')

  const [serviceProject, service] = taskData.externalServiceName?.split('@')

  if (taskProject.toLowerCase() !== serviceProject) {
    throw new Error('Task project and service project must be the same.')
  }
  Logger.debug('commit-msg payload validated')
}

module.exports = validateFindOrCreateExtData