import { Elevators } from "../js/elevators";

export default function AuditorInfo(){
    return (
    <div className="block">
        <table className="tableHeadInfo">
        <tbody>

        <tr>
          <td>Inspection organization</td>
          <td></td>
        </tr>
        <tr>
          <td>.</td>
          <td></td>
        </tr>
        <tr>
          <td>.</td>
          <td></td>
        </tr>
        <tr>
          <td>Inspector Name</td>
          <td>{Elevators.ElevatorInspectorName}</td>
        </tr>
        <tr>
          <td>Date of inspection</td>
          <td>{Elevators.ElevatorsDate}</td>
        </tr>
        <tr>
          <td>Sign</td>
          <td></td>
        </tr>

        </tbody>
      </table>
    </div>
    )
}