# Change Log

## [0.2.0] - 2025-07-04

### Changed
- Refactored codebase for maintainability and scalability:
  - Split logic into `src/providers/`, `src/utils/`, and `src/state/` folders
  - Moved WebviewViewProvider to its own module
  - Added utility modules for file walking and icon mapping
  - Added state management for ignored folders
- Updated documentation and project structure for best practices

## [1.0.0] - 2025-07-02

### Added
- Sidebar view with file type summary (icons, counts, percentages)
- Material Design icons for file types
- Ignore folders with chips and in-sidebar selection
- Theme-aware UI (chips, buttons, text)