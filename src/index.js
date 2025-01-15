import './style/bootstrap.min.css';
import './style/index.scss';
import './handle'

import Analyzer from './service/Scoreboard/Analyzer'

const analyzer = new Analyzer()

console.log(analyzer, analyzer.get())