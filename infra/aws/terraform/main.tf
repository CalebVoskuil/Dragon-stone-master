terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "proofs" {
  bucket = var.s3_bucket_name
  force_destroy = false

  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "proofs" {
  bucket = aws_s3_bucket.proofs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_db_subnet_group" "rds" {
  name       = "stone-dragon-rds-subnet-group"
  subnet_ids = var.rds_subnet_ids
}

resource "aws_security_group" "rds" {
  name        = "stone-dragon-rds-sg"
  description = "RDS PostgreSQL access"
  vpc_id      = var.vpc_id

  ingress {
    description = "Postgres"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.rds_ingress_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "stone-dragon-postgres"
  engine                  = "postgres"
  engine_version          = var.rds_engine_version
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  max_allocated_storage   = var.rds_max_allocated_storage
  db_name                 = var.rds_db_name
  username                = var.rds_username
  password                = var.rds_password
  publicly_accessible     = var.rds_public
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_db_subnet_group.rds.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  storage_encrypted       = true
  deletion_protection     = false
  backup_retention_period = var.rds_backup_retention_days

  tags = var.tags
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "s3_bucket_name" {
  value = aws_s3_bucket.proofs.id
}


