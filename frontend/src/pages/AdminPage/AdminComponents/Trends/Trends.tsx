import { FC, useEffect, useState } from "react";
import styles from './Trends.module.css'
import { ITrend } from "../../../../models/ITrend";
import { Section } from "../NavBar/NavBar";
import RuleService from "../../../../servises/RuleService";

interface TrendsInterface {
  timeframe: Section
}

const Trends: FC<TrendsInterface> = ({ timeframe }) => {
  const [trends, setTrends] = useState<ITrend[]>([]);

  const getTrends = async (timeframe: string) => {
    try {
      const response = (await RuleService.getTrends(timeframe)).data;
      console.log(response);

      setTrends(response);
    } catch (e: any) {
      console.log(e);
    }
  }

  useEffect(() => {
    getTrends(timeframe.val)
  }, [timeframe])

  return (
    <div className={styles.trends}>
      <h1>{timeframe.name}</h1>

      <table className={styles.trendTable}>
        <thead>
          <tr>
            <th>Candle</th>
            <th>VN</th>
            <th>NN</th>
            <th><span className={styles.ruleSection}>Rule</span> Short Signals</th>
            <th>Total Shorts</th>
            <th><span className={styles.ruleSection}>Rule</span> Long Signals</th>
            <th>Total Longs</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {trends.map((elem: ITrend) => (
            <tr key={elem.trendid}>
              <td>
                #{elem.candle_num}
                <span className={styles.coloredSquare} style={{ backgroundColor: elem.candle_color }}></span>
              </td>
              <td>{elem.shorts.toFixed(2)} ({(elem.shorts * 100 / (elem.longs + elem.shorts)).toFixed(2)}%)</td>
              <td>{elem.longs.toFixed(2)} ({(elem.longs * 100 / (elem.longs + elem.shorts)).toFixed(2)}%)</td>
              <td>
                <ul className={styles.subtable}>
                    <li>
                        <div><b>R2Short:</b></div>
                        <div className={styles.value}>{elem.rshort}</div>
                    </li>
                    <li>
                        <div><b>4AShort:</b></div>
                        <div className={styles.value}>{elem.ashort}</div>
                    </li>
                    <li>
                        <div><b>4BShort:</b></div>
                        <div className={styles.value}>{elem.bshort}</div>
                    </li>
                    <li>
                        <div><b>GFLY:</b></div>
                        <div className={styles.value}>{elem.gfly}</div>
                    </li>
                </ul>
              </td>
              <td>{elem.total_short}</td>
              <td>
                <ul className={styles.subtable}>
                    <li>
                        <div><b>R1Long:</b></div>
                        <div>{elem.rlong}</div>
                    </li>
                    <li>
                        <div><b>3ALong:</b></div>
                        <div>{elem.along}</div>
                    </li>
                    <li>
                        <div><b>3BLong:</b></div>
                        <div>{elem.blong}</div>
                    </li>
                    <li>
                        <div><b>BFLY:</b></div>
                        <div>{elem.bfly}</div>
                    </li>
                </ul>
              </td>
              <td className={styles.roundedNumber}>{elem.total_long}</td>
              <td className={styles.timestamp}>{elem.timestamp.substring(0, 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Trends;
