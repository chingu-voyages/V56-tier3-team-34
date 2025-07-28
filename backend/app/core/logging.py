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

    # Control SQLAlchemy logging to avoid duplicates
    sa_logger = logging.getLogger("sqlalchemy.engine")
    sa_logger.setLevel(logging.INFO)  # Or WARNING to reduce noise
    sa_logger.propagate = False  # Avoid duplication if root also logs
