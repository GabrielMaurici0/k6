provider "github" {
  token = var.github_token
  owner = var.github_owner
}

resource "github_repository" "perf_repo" {
  name        = var.repository_name
  visibility  = "private"
  description = "Pipeline de testes de performance"
}