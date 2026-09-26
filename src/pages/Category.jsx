import { ShowTitleButton } from "../components/ShowTitleButton";

export function Category() {
	return (
        <div className="container-fluid">
             <div className="d-flex">
                <div className="btncolumn">
                    <ShowTitleButton title="The Beverly Hillbillies" />
                    <ShowTitleButton title="Monk" />
                    <ShowTitleButton title="Star Trek: The Next Generation" />
                    <ShowTitleButton title="The A-Team" />
                    <ShowTitleButton title="Inspector Gadget" />
                    <ShowTitleButton title="Benson" />
                    <ShowTitleButton title="M*A*S*H" />
                    <ShowTitleButton title="The Addams Family" />
                    <ShowTitleButton title="Dragnet" />
                    <ShowTitleButton title="Seinfeld" />
                    <ShowTitleButton title="The Love Boat" />
                    <ShowTitleButton title="Gilligan's Island" />
                    <ShowTitleButton title="Leave It To Beaver" />
                </div>
                <div className="flex-grow-1 border border-1 border-primary">
                    <h1 className="text-center text-secondary fw-bold mt-4">[ Category Heading ]</h1>
                    <div className="text-center">
                        <img src="/freetv.png" width="250" alt="FreeTV Logo" title="FreeTV" style={{ marginTop: '10vh' }}/>
                    </div>
                </div>
             </div>
        </div>
	);
}
