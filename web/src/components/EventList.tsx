type TProps = { messages: string[] };
export default ({ messages }: TProps) => {
  return (
    <table className="table table-zebra table-compact">
      <tbody>
        {messages.map((v, i) => {
          return (
            <tr key={i}>
              <td>{v}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
