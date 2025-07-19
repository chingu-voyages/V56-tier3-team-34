# app/core/logging.py

import logging
import sys


def setup_logging():
    """
    Configures logging for the app.
    - Console output
    - Structured and timestamped
    - Can be extended to file, external systems
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
