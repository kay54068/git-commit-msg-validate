
| [Chinese readme][chinese-link] | [English readme][english-link] |
|--------------------------------|--------------------------------|
|                                |                                |

# 介紹

此專案使用參考 [angular commit message guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines
) 所定的規範

 驗證以下 commit 格式:
 
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```


# 專案資訊


| [License][license-link] | [Release][release-link] | [Download][download-link] | [Issues][issues-link] | [Wiki][wiki-links] |
|-------------------------|-------------------------|---------------------------|-----------------------|--------------------|
| ![license-badge]        | ![release-badge]        | ![download-badge]         | ![issues-badge]       | ![wiki-badge]      |




[release-link]: https://github.com/kay54068/git-commit-msg-validate/releases "Release status"
[release-badge]: https://img.shields.io/github/release/kay54068/git-commit-msg-validate.svg?style=flat-square "Release status"

[download-link]: https://github.com/kay54068/git-commit-msg-validate/releases/latest "Download status"
[download-badge]: https://img.shields.io/github/downloads/kay54068/git-commit-msg-validate/total.svg?style=flat-square "Download status"

[license-link]: https://github.com/kay54068/git-commit-msg-validate/blob/master/LICENSE "LICENSE"
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg "MIT"


[issues-link]: https://github.com/kay54068/git-commit-msg-validate/issues "Issues"
[issues-badge]: https://img.shields.io/badge/github-issues-red.svg?maxAge=60 "Issues"

[wiki-links]: https://github.com/kay54068/git-commit-msg-validate/wiki "wiki"
[wiki-badge]: https://img.shields.io/badge/github-wiki-181717.svg?maxAge=60 "wiki"


[english-link]: https://github.com/kay54068/git-commit-msg-validate/blob/master/README_en.md "english README"

[chinese-link]: https://github.com/kay54068/git-commit-msg-validate/blob/master/README.md "中文 README"


# 編譯前置作業

## 安裝 nodejs

- linux
  ```
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  ```

  ```
  sudo apt install nodejs
  ```
  * check
  ```
  node --version
  npm --version
  ```
## 安裝 pkg

```
sudo npm install -g pkg
```

## 編譯及測試

```
npm i
npm test
```

## 編譯 binary 檔

cd git-commit-msg-validate
mkdir build
cd build
pkg ../

# 使用說明

## 配置

1. 於你的 repository root 新增 *package.json* :
 
```json
{
  "//": "repository Config",
  "name":"Your Project Name",
  "description": "Your description",
  "homepage": "",
  "repository": {
    "type": "git",
    "url": "http://your_repo.git"
  }
}
```

2. 於你的 repository root 新增 *.vcmrc* :

e.g.

```json
{
  "helpMessage": "\n請協助完善 Commit 資訊, 必要時請協助維護 .vcmrc 檔案的 types or scope[allowed] 項目!!\n",
  "scopesetting": {
    "required": false,
    "validate": true,
    "multiple": false
  },
  "maxSubjectLength": 100,
  "warnOnFail": false,
  "autoFix": true,
  "blanklineErrorMsg": "第二行必須為空白行, 用於區分主旨與內文",
  "patternErrorMsg": "格式不符,請使用以下格式:\n <type>(<scope>):<空格>新增/修改/修正/刪除/重構/優化 <subject> ",
  "scopes": {
    "Docs":                 "文件相關",
    "Tool":                 "工具程式相關",
    "Shell":                "Shell Script相關",
    "QtConfig":            "Qt 專案配置相關",
    "GitConfig":           "Git 板控配置相關"
  },
  "scopeErrorMsg": "scope 無效,請使用以下 scope: ",

  "types": {
    "fix":          "Bug Fixes",
    "feat":         "New Features",
    "release":      "Release Version",
    "refactor":     "Refactors",
    "merge":        "Branch merge",
    "revert":       "Reverts",
    "docs":         "Documentation Changes",
    "perf":         "Performance Improvements",
    "style":        "Code Style Changes",
    "misc":         "Miscellaneous",
    "build":        "Build System / Dependencies",
    "ci":           "Continuous Integration",
    "test":         "Tests"
  },
  "typePatternErrorMsg": "type 無效,請使用以下type: ",

  "subjectPattern": "新增|修改|修正|刪除|重構|合併|優化",
  "subjectPatternErrorMsg": "subject 無效, 請確認是否有包含以下其中字串: "
}
```

## 參數說明

> 格式如下：
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

### types

> commit 類別

請參考資訊:

[angular commit message guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines
)

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/）
)
### typePatternErrorMsg
> type 欄位驗證錯誤訊息

### scope
> commit 作用範圍

format:
```json
  "scopes": {
    "key":                 "value"
  }
```

example:
```json
  "scopes": {
    "Docs":                 "文件相關",
    "Tool":                 "工具程式相關",
    "Shell":                "Shell Script相關",
    "QtConfig":            "Qt 專案配置相關",
    "GitConfig":           "Git 板控配置相關"
  }
```
### scopeErrorMsg
> scope 欄位驗證錯誤訊息

### subjectPattern

> commit 主旨 （RegExp match）

example:
```
"subjectPattern": "新增|修改|修正|刪除|重構|合併|優化",
```

### subjectPatternErrorMsg
> subject 欄位驗證錯誤訊息

### blanklineErrorMsg

> `<BLANK LINE>` 欄位驗證錯誤訊息

### scopesetting
- required
  * 設定是否必須輸入 scope 欄位, default: false
- validate
  * 是否驗證 scope 欄位, default: true
- multiple
  * 是否驗證多個 scope 欄位, default: false

### warnOnFail

設定是否忽略錯誤只顯示錯誤訊息, default: false

### maxSubjectLength

主旨最大字串長度


### helpMessage

> 提示訊息


## Node 使用

example：


```javascript
var validateMessage = require('validate-commit-msg');

var valid = validateMessage('chore(index): an example commit message');

// valid = true
```

## Git precommit 使用

請參考以下範例：
![](git-commit-msg-hook-example/commit-msg)

```sh
#!/usr/bin/env bash
############################################################
#                 Variable
############################################################
os_version=$(uname -s)
dir=`pwd`

###############################################################
#                 Function
###############################################################

## Commit 格式校驗 ##
validateCommitMsg(){

echo "run validateCommitMsg..."
cmd_linux=$dir/.githooks/validate-commit-msg-linux
cmd_windows=$dir/.githooks/validate-commit-msg-win.exe

if [[ $os_version =~ "Linux" ]]; then
  echo "linux"
  $cmd_linux "`cat .git/COMMIT_EDITMSG`"
elif [[ $os_version =~ "MINGW" ]]; then   
  echo "Windows"
  $cmd_windows "`cat .git/COMMIT_EDITMSG`"
elif [[ $os_version =~ "Darwin" ]]; then
  echo "Mac OS X"
  $cmd_linux "`cat .git/COMMIT_EDITMSG`"
fi
}

###############################################################
#                   Main Content
###############################################################

## validateCommitMsg ##
validateCommitMsg

```
## CI 使用

example:

```
validate-commit-msg "$(git log -1 --pretty=%B)"
```


# 多個 Repository 使用

範例:

```
my-lerna-repo/
  package.json
  packages/
    package-1/
      package.json
    package-2/
      package.json
```

packages.json 設定

e.g.

```json
{
  "config": {
    "validate-commit-msg": {
      "scope": {
        "required": true,
        "allowed": ["package-1", "package-2"],
        "validate": true,
        "multiple": true
      },
    }
  }
}
```