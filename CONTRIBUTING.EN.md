
> English | [简体中文](./CONTRIBUTING.md)
# Contributing

Thank you for taking your time to contribute and make this project better! Here are some guidelines to help you get started. Please make sure to take a moment and read through them before submitting your contributions.

## Code of Conduct

This project is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to adhere to it.

## Open Development

All work happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

This project follows semantic versioning. We release patch versions for bug fixes or other changes that do not change the behavior of the API, minor versions for new features that are backward-compatible, and major versions for any breaking changes.

Every significant change is documented in the changelog file.

## Reporting Issues

We use [Github issues](https://github.com/LIjiAngChen8/datepicker-pro-vue/issues) for bug reports and feature requests. Before reporting an issue, please make sure you have searched for similar [issues](https://github.com/LIjiAngChen8/datepicker-pro-vue/issues) as they may have been already answered or being fixed. A new issue should be submitted via [issue helper](https://github.com/LIjiAngChen8/datepicker-pro-vue/issues). For bug reporting, please include the minimum code that can be used to reproduce the problem. For feature request, please specify what changes you want and what behavior you expect.

## Sending a pull request

1. Fork [the repository](https://github.com/LIjiAngChen8/datepicker-pro-vue) and create your branch from `main`. For new feature, please submit your changes directly to the `feature` branch. Other changes should go against `beta` branch.
2. Use `yarn install` to install project dependencies.
3. Use `yarn dev` to initialize the project.
4. Run `yarn lint-staged` to check and fix code.
5. Make changes to the codebase. Please add tests if applicable.
6. Make sure the test suite passes with `yarn test`.
7. Commit your changes, adhering to the [Commit Guidelines](#commit-guidelines)
8. Open a new pull request, [referencing corresponding issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) if available.

## Commit Guidelines

Commit messages are required to follow the [conventional-changelog standard](https://www.conventionalcommits.org/en/v1.0.0/):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit types

The following is a list of commit types:

- feat: New feature or functionality
- fix: Bug fix
- docs: Documentation update
- style: Code style or component style updates
- refactor: Code refactoring (refactoring, code modification without affecting internal code behavior or functionality)
- perf: Performance optimization
- test: Unit testing
- build: Changes affecting project builds or dependencies
- revert: Revert previous commit
- ci: Continuous integration related file changes
- chore: Other changes (modifications not included in the above types)
- workflow: Workflow related file changes

### Web-Vue Component Directory

```
├── build (注意：非必要请勿变动该rollup配置文件)
├── dist (注意：不用编辑该文件夹下的文件，它是由rollup打包生成的)
├── example (演示)
│   └── xxx
└── src (项目)
│   │
│   │── common (通用组件)
│   │── icon（图标组件）
│   │── panels（面板相关组件）
│   │── popper （弹窗组件）
│   │── style
│   │   └── xxx.less(组件样式)
│   │   └── xxx.less
│   │   └── index.js (组件样式导出)
│   │── utils (工具)
│   └── index.js （组件导出）
│
├── test
│   ├── __snapshots__
│   │   └── demo.test.js.snap
│   ├── demo.test.js (快照测试)
│   └── index.test.js (单元测试)
│ 
└── ....（项目相关配置文件）

```


## License

By contributing your code to the repository, you agree to license your contribution under the [MIT license](./LICENSE).
