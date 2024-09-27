'''
MariaDB status flags

These flags describe the current status of the database server.
'''

IN_TRANS = 1
AUTOCOMMIT = 2
MORE_RESULTS_EXIST = 8
QUERY_NO_GOOD_INDEX_USED = 16
QUERY_NO_INDEX_USED = 32
CURSOR_EXISTS = 64
LAST_ROW_SENT = 128
DB_DROPPED = 256
NO_BACKSLASH_ESCAPES = 512
METADATA_CHANGED = 1024
QUERY_WAS_SLOW = 2048
PS_OUT_PARAMS = 4096
IN_TRANS_READONLY = 8192
SESSION_STATE_CHANGED = 16384
ANSI_QUOTES = 32768
