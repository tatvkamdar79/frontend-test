import React, { useEffect, useState } from "react";
import AddItemModal from "../components/AddItemModal";

const Items = () => {
  const [draftItems, setDraftItems] = useState({});
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [draftDetails, setDraftDetails] = useState(null);
  const [selectedDraftName, setSelectedDraftName] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("draftItems") === undefined) {
      localStorage.setItem("draftItems", JSON.stringify(draftItems));
    } else {
      try {
        let parsedJson = JSON.parse(localStorage.getItem("draftItems"));
        setDraftItems(parsedJson);
      } catch (e) {
        localStorage.setItem("draftItems", JSON.stringify(draftItems));
      }
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-start">
      <section className="w-[25%] xl:w-[15%]">
        <SideBar setOpenAddItemModal={setOpenAddItemModal} />
      </section>
      <section
        className={`w-[75%] xl:w-[85%] bg-gray-200 p-5 ${
          openAddItemModal && "blur-[1.5px]"
        }`}
      >
        <p className="text-2xl font-semibold text-gray-700 underline mb-4">
          {Object.keys(draftItems).length === 0
            ? "You Have No Drafts"
            : "Draft Items"}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 place-items-center gap-x-5 gap-y-10">
          {draftItems &&
            Object.keys(draftItems).map((draftName, index) => (
              <div
                key={index}
                onClick={() => {
                  let newDraftItem = { ...draftItems };
                  setDraftDetails(newDraftItem[draftName]);
                  setOpenAddItemModal(true);
                  setSelectedDraftName(draftName);
                }}
              >
                <DraftCard
                  setOpenAddItemModal={setOpenAddItemModal}
                  draftName={draftName}
                  draft={draftItems[draftName]}
                  draftDetails={draftDetails}
                  setDraftDetails={setDraftDetails}
                  setSelectedDraftName={setSelectedDraftName}
                />
              </div>
            ))}
        </div>
      </section>

      <section
        className={`${
          !openAddItemModal && "hidden"
        } absolute flex w-full h-screen place-items-center`}
      >
        <div className="w-full">
          {openAddItemModal && (
            <AddItemModal
              setOpenAddItemModal={setOpenAddItemModal}
              draftItems={draftItems}
              setDraftItems={setDraftItems}
              draftDetails={draftDetails}
              setDraftDetails={setDraftDetails}
              selectedDraftName={selectedDraftName}
              setSelectedDraftName={setSelectedDraftName}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Items;

const SideBar = ({ setOpenAddItemModal }) => {
  return (
    <div className="h-full w-full bg-gray-300 flex flex-col justify-start p-6">
      <p className="flex justify-between place-items-center text-2xl text-gray-600 font-semibold underline mb-10">
        Sidebar
      </p>
      <ul className="text-base text-gray-700 space-y-2">
        <button
          onClick={() => setOpenAddItemModal(true)}
          className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer"
        >
          Add Item
        </button>
        <button className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          Manage Items
        </button>
      </ul>
    </div>
  );
};

const DraftCard = ({
  setOpenAddItemModal,
  draftName,
  draft,
  setDraftDetails,
  setSelectedDraftName,
}) => {
  return (
    <div className="w-64 h-40 flex flex-col justify-center border-2 border-gray-400 rounded-md p-3 bg-orange-200 shadow-xl shadow-gray-300 hover:scale-105 hover:bg-green-200 transition-all duration-200 cursor-pointer">
      <p className="text-gray-800 font-semibold underline">{draftName}</p>
      <div className="text-sm font-semibold text-gray-500 p-2">
        <p>Company: {draft.company !== "" ? draft.company : "NA"}</p>
        <p>
          Product Code: {draft.productCode !== "" ? draft.productCode : "NA"}
        </p>
        <p>
          Product Title: {draft.productTitle !== "" ? draft.productTitle : "NA"}
        </p>
        <p>
          Model Number: {draft.modelNumber !== "" ? draft.modelNumber : "NA"}
        </p>
      </div>
    </div>
  );
};