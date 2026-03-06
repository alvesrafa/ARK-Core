# Azure Infrastructure — Activity Log

Templates Bicep para capturar o Azure Activity Log (subscription-level) e enviar para um Log Analytics Workspace.

## Recursos provisionados

- **Resource Group** — agrupa os recursos de monitoramento
- **Log Analytics Workspace** — destino dos logs
- **Diagnostic Setting (subscription)** — encaminha todas as categorias do Activity Log:
  Administrative, Security, ServiceHealth, Alert, Recommendation, Policy, Autoscale, ResourceHealth

## Pre-requisitos

- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) >= 2.61
- Bicep CLI (incluido no Azure CLI)
- Permissoes de **Owner** ou **Contributor + Monitoring Contributor** na subscription
- Login ativo: `az login`

## Comandos

### Validar sintaxe

```bash
az bicep build --file deploy/azure/main.bicep
```

### What-if (preview das alteracoes)

```bash
az deployment sub what-if \
  --location brazilsouth \
  --template-file deploy/azure/main.bicep \
  --parameters deploy/azure/parameters/dev.bicepparam
```

### Deploy

```bash
az deployment sub create \
  --location brazilsouth \
  --template-file deploy/azure/main.bicep \
  --parameters deploy/azure/parameters/dev.bicepparam
```

## Estrutura

```
deploy/azure/
  main.bicep                  # Template principal (subscription-level)
  modules/
    log-analytics.bicep       # Log Analytics Workspace
    activity-log.bicep        # Diagnostic Setting do Activity Log
  parameters/
    dev.bicepparam            # Parametros do ambiente dev
  README.md
```
