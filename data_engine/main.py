import logging
from pathlib import Path
from .loader import load_and_process_data
from .indicators import IndicatorEngine
from .scoring import ScoringEngine
from .analytics import AnalyticsEngine

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting UEI Data Engine Pipeline...")
    
    # 1. Load and Process Data
    logger.info("Step 1: Data Loading & Processing")
    load_and_process_data()
    
    # 2. Calculate Indicators
    logger.info("Step 2: Indicator Computation")
    indicator_engine = IndicatorEngine()
    indicator_engine.run()
    
    # 3. Compute Scores
    logger.info("Step 3: Scoring & Weighting")
    scoring_engine = ScoringEngine()
    scoring_engine.compute_scores()
    
    # 4. Spatial Analytics
    logger.info("Step 4: Spatial Analytics")
    analytics_engine = AnalyticsEngine()
    analytics_engine.run()
    
    logger.info("UEI Pipeline Completed Successfully!")

if __name__ == "__main__":
    main()
