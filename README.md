# Core Service

This is core service.

## How to Deploy

Set project id and region.

``` bash
export PROJECT_ID='PROJECT_ID'
export REGION='REGION'
```

Create a repository.

```bash
gcloud artifacts repositories create containers-repo \
    --repository-format=docker \
    --description="Containers repository" \
    --location=$REGION \
    --project $PROJECT_ID
```

Build image and push to 'Artifact Registry'

```bash
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/containers-repo/capstone/core:'version' --project $PROJECT_ID
```

Setup environment

```bash
cp env.yml.example env.yml
```

Deploy to 'Cloud Run'

```bash
gcloud run deploy core-service --image $REGION-docker.pkg.dev/$PROJECT_ID/containers-repo/capstone/core:'version' \
    --max-instances 1 \
    --min-instances 1 \
    --port 3000 \
    --env-vars-file 'env.yml' \
    --allow-unauthenticated \
    --project $PROJECT_ID \
    --region $REGION
```
