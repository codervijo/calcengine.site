PROJ := calcengine.site

.DEFAULT_GOAL := help

# Verify parent Makefile exists — this project is part of codervijo's sites repo.
ifeq ($(wildcard ../Makefile),)
$(error This Makefile is meant to be run inside codervijo's sites project only. Parent Makefile not found.)
endif

# Forward every target to the parent Makefile with proj set to this project.
%:
	$(MAKE) -C .. $@ proj=$(PROJ)
