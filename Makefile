build:
	npm run build

# usage: make version=1.0.0 publish
publish: build tag
	npm run publish

# usage: make version=1.0.0 tag
tag:
	git tag -a v$(version) -m "v$(version)"
	git push origin v$(version)