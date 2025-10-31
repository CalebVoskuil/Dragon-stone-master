# Terraform for AWS (RDS + S3)

## Usage

1. Prepare variables (via `terraform.tfvars` or CLI):

```
aws_region = "us-east-1"
s3_bucket_name = "stone-dragon-proofs-<unique>"
vpc_id = "vpc-xxxxxxxx"
rds_subnet_ids = ["subnet-aaaa", "subnet-bbbb"]
rds_ingress_cidrs = ["10.0.0.0/16"]
rds_db_name = "stonedragon"
rds_username = "stonedragon"
rds_password = "change-me"
```

2. Init & apply:

```
terraform init
terraform apply
```

## Outputs

- `rds_endpoint`
- `s3_bucket_name`

Use these for backend env vars.


