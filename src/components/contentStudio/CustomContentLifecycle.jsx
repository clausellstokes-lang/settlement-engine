/*
 * Public lifecycle surface for authored content. The implementation is split
 * by concern so history inspection and archive recovery stay readable on their
 * own while callers retain one stable import boundary.
 */
export { default as ContentDefinitionHistory } from './ContentDefinitionHistory.jsx';
export { default as ArchivedContentLibrary } from './ArchivedContentLibrary.jsx';
