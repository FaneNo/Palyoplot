import styles from "../cssPages/dashboardNav.module.css";
import { dashboardNavIcon } from "./dashboardNavIcon";

function DashboardNav() {
  return (
    <>
      <div className={`${styles.dashBoardNavBody}`}>
        <div className={`${styles.sidebar}`}>
          <ul className={`${styles.sidebarList}`}>
            {dashboardNavIcon.map((val, key) => {
              return (
                <li
                  key={key}
                  className={`${styles.sidebarRow} ${
                    window.location.pathname == val.link ? styles.active : ""
                  }`}
                  onClick={() => {
                    window.location.pathname = val.link;
                  }}
                >
                  <div className={`${styles.icon}`}>
                    <img src={val.icon} alt="icon" />
                  </div>
                  <div className={`${styles.title}`}>{val.title}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default DashboardNav;
