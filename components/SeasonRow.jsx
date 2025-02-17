import ExpandCollapseIcon from "./ExpandCollapseIcon";
export default function SeasonRow({ showName, seasonNum, expanded, onToggle }) {
    return (
      <tr className="bg-gray-100 border-b border-gray-200">
        <td className="p-4 w-12 pl-6">
          <button onClick={onToggle}>
            <ExpandCollapseIcon expanded={expanded} />
          </button>
        </td>
        <td className="p-4 text-lg" colSpan={2}>
          Season {seasonNum}
        </td>
      </tr>
    );
  }
  