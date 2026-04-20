const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// プロジェクトのルートディレクトリ
const projectRoot = __dirname;
// モノレポのルートディレクトリ (一つ上)
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. 全ての node_modules を監視対象に含める
config.watchFolders = [workspaceRoot];

// 2. モジュールの解決順序を整理
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. 依存関係の重複を避けるための設定
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
