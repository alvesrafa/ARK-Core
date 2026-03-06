@description('Nome do Log Analytics Workspace')
param workspaceName string

@description('Localizacao do recurso')
param location string

@description('Dias de retencao dos logs')
@minValue(30)
@maxValue(730)
param retentionInDays int = 90

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: retentionInDays
  }
}

@description('Resource ID do Log Analytics Workspace')
output workspaceId string = workspace.id
