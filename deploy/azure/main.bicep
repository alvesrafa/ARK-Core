targetScope = 'subscription'

@description('Nome do Resource Group')
param resourceGroupName string

@description('Localizacao dos recursos')
param location string

@description('Nome do Log Analytics Workspace')
param workspaceName string

@description('Dias de retencao dos logs')
param retentionInDays int = 90

@description('Nome do Diagnostic Setting do Activity Log')
param diagnosticSettingName string = 'ds-activity-log'

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module logAnalytics 'modules/log-analytics.bicep' = {
  name: 'deploy-log-analytics'
  scope: rg
  params: {
    workspaceName: workspaceName
    location: location
    retentionInDays: retentionInDays
  }
}

module activityLog 'modules/activity-log.bicep' = {
  name: 'deploy-activity-log'
  params: {
    diagnosticSettingName: diagnosticSettingName
    workspaceId: logAnalytics.outputs.workspaceId
  }
}
