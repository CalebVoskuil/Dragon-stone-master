variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to resources"
  default     = {}
}

variable "s3_bucket_name" {
  type        = string
  description = "S3 bucket name for proof uploads"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID for RDS"
}

variable "rds_subnet_ids" {
  type        = list(string)
  description = "Private subnet IDs for RDS"
}

variable "rds_ingress_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to connect to RDS"
}

variable "rds_engine_version" {
  type        = string
  description = "PostgreSQL engine version"
  default     = "15.5"
}

variable "rds_instance_class" {
  type        = string
  description = "RDS instance class"
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  type        = number
  description = "Initial storage (GB)"
  default     = 20
}

variable "rds_max_allocated_storage" {
  type        = number
  description = "Max autoscaling storage (GB)"
  default     = 100
}

variable "rds_db_name" {
  type        = string
  description = "Database name"
}

variable "rds_username" {
  type        = string
  description = "Master username"
}

variable "rds_password" {
  type        = string
  description = "Master password"
  sensitive   = true
}

variable "rds_public" {
  type        = bool
  description = "Whether RDS is publicly accessible"
  default     = false
}

variable "rds_backup_retention_days" {
  type        = number
  description = "Backup retention period"
  default     = 7
}


