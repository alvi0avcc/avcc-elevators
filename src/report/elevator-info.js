import { Elevators } from "../js/elevators";

export default function ElevatorInfo(){
    return (
    <div className="block">
        <table className="tableHeadInfo">
        <tbody>

        <tr>
          <td>Elevator Name</td>
          <td>{Elevators.ElevatorsName}</td>
        </tr>
        <tr>
          <td>Owner</td>
          <td>{Elevators.ElevatorOwner}</td>
        </tr>
        <tr>
          <td>Adress</td>
          <td>{Elevators.ElevatorAdress}</td>
        </tr>
        <tr>
          <td>Elevator representative</td>
          <td>{Elevators.ElevatorContactName}</td>
        </tr>
        <tr>
          <td>Date</td>
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