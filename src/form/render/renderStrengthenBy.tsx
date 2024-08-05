import { _localized } from "../../localized"
import type { RenderEnquiryOptions } from "../types"

export function renderStrengthenBy(options: RenderEnquiryOptions | undefined) {
  return (
    <a class="_q-qlogo" href="https://qualtive.io/" target="_blank" rel="noopener">
      <span>{_localized("form.strengthen", options?.locale)}</span>
      <svg width="68" height="14" viewBox="0 0 68 14" fill="none">
        <path
          d="M6.34681 11.4271C5.39313 11.4271 4.52303 11.2938 3.73649 11.0273C2.95978 10.7509 2.29614 10.3561 1.74556 9.84282C1.20482 9.31967 0.806634 8.70273 0.551009 7.99203C0.44286 7.68603 0.359291 7.36522 0.3003 7.02961C0.251142 6.68413 0.226562 6.32878 0.226562 5.96355C0.226562 5.71678 0.236394 5.47988 0.256058 5.25285C0.275721 5.01595 0.310132 4.78891 0.359291 4.57175C0.418281 4.35459 0.482187 4.14237 0.551009 3.93508C0.806634 3.22437 1.20482 2.61238 1.74556 2.09909C2.28631 1.5858 2.94503 1.19096 3.72174 0.914578C4.50828 0.638193 5.37839 0.5 6.33206 0.5C7.29557 0.5 8.16568 0.638193 8.94238 0.914578C9.72892 1.19096 10.3926 1.5858 10.9333 2.09909C11.4741 2.61238 11.8722 3.22437 12.1279 3.93508C12.236 4.24108 12.3147 4.56682 12.3638 4.9123C12.4228 5.24791 12.4523 5.59833 12.4523 5.96355C12.4523 6.21033 12.4425 6.45216 12.4228 6.68907C12.4032 6.9161 12.3638 7.13819 12.3048 7.35535C12.2557 7.57251 12.1967 7.78474 12.1279 7.99203C11.8624 8.69286 11.4642 9.30486 10.9333 9.82802C10.4024 10.3413 9.74367 10.7361 8.95713 11.0125C8.18043 11.2889 7.31032 11.4271 6.34681 11.4271ZM6.33206 9.63554C6.95146 9.63554 7.50695 9.5467 7.99854 9.36902C8.49012 9.18147 8.90797 8.91989 9.25208 8.58428C9.60603 8.24867 9.86657 7.84396 10.0337 7.37016C10.0829 7.2221 10.1222 7.07403 10.1517 6.92597C10.191 6.76803 10.2156 6.6101 10.2254 6.45217C10.2451 6.29423 10.2549 6.13136 10.2549 5.96355C10.2549 5.70691 10.2353 5.46507 10.1959 5.23804C10.1664 5.00114 10.1124 4.77411 10.0337 4.55695C9.86657 4.09302 9.61094 3.69324 9.26683 3.35763C8.92272 3.01215 8.49996 2.75057 7.99854 2.57289C7.50695 2.38535 6.95146 2.29157 6.33206 2.29157C5.7225 2.29157 5.167 2.38535 4.66559 2.57289C4.174 2.75057 3.75615 3.01215 3.41204 3.35763C3.06793 3.69324 2.81231 4.09302 2.64517 4.55695C2.59601 4.70501 2.55176 4.85801 2.51244 5.01595C2.48294 5.16401 2.45836 5.31701 2.4387 5.47494C2.42887 5.63288 2.42395 5.79575 2.42395 5.96355C2.42395 6.2202 2.4387 6.46697 2.4682 6.70387C2.50752 6.9309 2.56651 7.153 2.64517 7.37016C2.81231 7.83409 3.06793 8.2388 3.41204 8.58428C3.75615 8.91989 4.174 9.18147 4.66559 9.36902C5.167 9.5467 5.7225 9.63554 6.33206 9.63554ZM7.82157 13.5C7.10385 13.5 6.56802 13.3421 6.21408 13.0262C5.86997 12.7202 5.69792 12.2267 5.69792 11.5456V10.5683H7.27591V11.8417H10.5646V13.5H7.82157Z"
          fill="black"
        />
        <path
          d="M17.0541 11.3975C16.4052 11.3975 15.8596 11.279 15.4172 11.0421C14.9846 10.8052 14.6552 10.4548 14.4291 9.99089C14.2128 9.52695 14.1046 8.95444 14.1046 8.27335V3.93508H16.1103V7.99203C16.1103 8.55467 16.243 8.98406 16.5085 9.28018C16.7838 9.57631 17.1918 9.72437 17.7325 9.72437C18.1356 9.72437 18.4846 9.63554 18.7796 9.45786C19.0746 9.28018 19.3007 9.03341 19.458 8.71754C19.6153 8.3918 19.6939 8.00683 19.6939 7.56264V3.93508H21.6996V11.1458H19.6939L20.1511 9.11731H19.9004C19.7333 9.6306 19.517 10.055 19.2515 10.3907C18.9861 10.7263 18.6714 10.978 18.3077 11.1458C17.9439 11.3136 17.5261 11.3975 17.0541 11.3975Z"
          fill="black"
        />
        <path
          d="M26.1986 11.3975C25.7758 11.3975 25.3973 11.3383 25.063 11.2198C24.7287 11.1112 24.4534 10.9484 24.2371 10.7312C24.0602 10.5535 23.9225 10.3462 23.8242 10.1093C23.7357 9.86257 23.6915 9.59605 23.6915 9.30979C23.6915 9.01367 23.7357 8.74715 23.8242 8.51025C23.9127 8.26348 24.0503 8.04632 24.2371 7.85877C24.4633 7.63174 24.7533 7.45406 25.1072 7.32574C25.471 7.19742 25.8938 7.11845 26.3755 7.08884L29.443 6.91116V8.11048L26.9212 8.30296C26.6951 8.3227 26.5033 8.36219 26.346 8.42141C26.1887 8.48064 26.0609 8.55961 25.9626 8.65831C25.9134 8.70767 25.8741 8.76196 25.8446 8.82118C25.8151 8.87054 25.7905 8.92976 25.7709 8.99886C25.761 9.05809 25.7561 9.12718 25.7561 9.20615C25.7561 9.31473 25.7709 9.41344 25.8004 9.50228C25.8299 9.58125 25.8839 9.65528 25.9626 9.72437C26.0412 9.81321 26.1543 9.88231 26.3018 9.93166C26.4591 9.97115 26.6459 9.99089 26.8622 9.99089C27.3636 9.99089 27.7815 9.88724 28.1157 9.67995C28.45 9.47266 28.6909 9.22589 28.8384 8.93964C28.9957 8.64351 29.0743 8.36219 29.0743 8.09567V6.51139C29.0743 6.44229 29.0743 6.38307 29.0743 6.33371C29.0448 6.09681 28.9613 5.89446 28.8236 5.72665C28.6958 5.54897 28.5041 5.41572 28.2485 5.32688C28.0027 5.23804 27.6979 5.19362 27.3341 5.19362C26.8229 5.19362 26.4394 5.27752 26.1838 5.44533C25.9282 5.61314 25.761 5.78588 25.6824 5.96355C25.6136 6.14123 25.5792 6.29916 25.5792 6.43736V6.48178H23.544V6.43736C23.5538 6.1511 23.6325 5.81055 23.78 5.41572C23.9274 5.01101 24.2814 4.62111 24.8418 4.24601C25.4022 3.87092 26.2428 3.68337 27.3636 3.68337C28.1895 3.68337 28.8777 3.79195 29.4283 4.00911C29.9789 4.22627 30.3918 4.55201 30.6671 4.98633C30.9424 5.41078 31.08 5.92901 31.08 6.541V11.1458H29.1038L29.5315 9.17654H29.2808C29.1432 9.67008 28.9367 10.0847 28.6614 10.4203C28.3959 10.746 28.0567 10.9879 27.6438 11.1458C27.2309 11.3136 26.7491 11.3975 26.1986 11.3975Z"
          fill="black"
        />
        <path d="M33.2918 0.781321H35.2975V11.1458H33.2918V0.781321Z" fill="black" />
        <path
          d="M41.3569 11.3975C40.6687 11.3975 40.0935 11.2938 39.6314 11.0866C39.1792 10.8793 38.84 10.5733 38.6138 10.1686C38.3877 9.75399 38.2746 9.24563 38.2746 8.64351V2.69134L40.2803 1.84738V8.6139C40.2803 8.99886 40.3737 9.29499 40.5605 9.50228C40.7473 9.70957 41.0177 9.81321 41.3716 9.81321C41.7649 9.81321 42.05 9.70463 42.227 9.48747C42.404 9.27031 42.4924 8.92483 42.4924 8.45103V7.53303H44.4834V8.49544C44.4834 9.09757 44.3605 9.61579 44.1147 10.0501C43.8689 10.4844 43.51 10.82 43.0381 11.0569C42.576 11.284 42.0156 11.3975 41.3569 11.3975ZM36.6966 3.93508H44.4834V5.46014H36.6966V3.93508Z"
          fill="black"
        />
        <path
          d="M46.2391 3.93508H48.2448V11.1458H46.2391V3.93508ZM46.1654 1.03303H48.348V2.86902H46.1654V1.03303Z"
          fill="black"
        />
        <path
          d="M49.644 3.93508H51.8119L53.8323 9.47266L53.9208 10.0797H54.1862L54.26 9.47266L56.2952 3.93508H58.463L55.661 11.1458H52.446L49.644 3.93508Z"
          fill="black"
        />
        <path
          d="M63.3332 11.3975C62.7728 11.3975 62.2615 11.3383 61.7994 11.2198C61.3374 11.1014 60.9293 10.9286 60.5754 10.7016C60.2313 10.4746 59.9462 10.1982 59.72 9.87244C59.5037 9.56644 59.3415 9.22096 59.2334 8.83599C59.1351 8.45103 59.0859 8.02658 59.0859 7.56264C59.0859 7.25664 59.1105 6.96545 59.1596 6.68907C59.2186 6.40281 59.2973 6.14123 59.3956 5.90433C59.5037 5.65756 59.6266 5.43052 59.7643 5.22324C59.9904 4.88762 60.2755 4.6063 60.6196 4.37927C60.9638 4.15224 61.3521 3.9795 61.7847 3.86105C62.2271 3.7426 62.6991 3.68337 63.2005 3.68337C64.0558 3.68337 64.7834 3.83144 65.3831 4.12756C65.9828 4.42369 66.4351 4.85308 66.7399 5.41572C67.0545 5.97836 67.2118 6.65452 67.2118 7.44419C67.2118 7.58238 67.2118 7.68109 67.2118 7.74032C67.2118 7.79954 67.2118 7.89332 67.2118 8.02164H60.3394V6.74829H65.2209C65.1914 6.22513 65.0046 5.82536 64.6605 5.54897C64.3262 5.27259 63.8444 5.1344 63.2152 5.1344C62.8219 5.1344 62.468 5.20349 62.1534 5.34169C61.8486 5.47988 61.6028 5.6773 61.416 5.93394C61.3374 6.06226 61.2685 6.21033 61.2095 6.37813C61.1506 6.54594 61.1063 6.72855 61.0768 6.92597C61.0572 7.11352 61.0473 7.32081 61.0473 7.54784C61.0473 7.88345 61.0768 8.18451 61.1358 8.45103C61.2046 8.70767 61.303 8.9347 61.4308 9.13212C61.6176 9.38876 61.8634 9.58618 62.1681 9.72437C62.4828 9.8527 62.8613 9.91686 63.3037 9.91686C63.6282 9.91686 63.9133 9.88231 64.1591 9.81321C64.4147 9.73424 64.631 9.62073 64.808 9.47266C64.9849 9.3246 65.1177 9.14693 65.2061 8.93964H67.2266C67.1184 9.42331 66.8874 9.8527 66.5334 10.2278C66.1795 10.593 65.7272 10.8793 65.1767 11.0866C64.6261 11.2938 64.0116 11.3975 63.3332 11.3975Z"
          fill="black"
        />
      </svg>
    </a>
  )
}
