%%%-------------------------------------------------------------------
%%% @author Federico Minniti, Tommaso Baldi, Matteo Del Seppia
%%% @copyright (C) 2022, <group_mbds>
%%% @doc
%%%
%%% @end
%%% Created : 07. feb 2022 19:05
%%%-------------------------------------------------------------------
-module(users_handler).
-author("group_mbds").

%% API
-export([init_server/0]).

% function to start the server
init_server() ->
  Server = self(),
  BattleShipPid = spawn( fun() -> battleship_daemon(Server, []) end ),
  server_loop(BattleShipPid).

% server node loop
server_loop(BattleShipPid) ->
  receive
    {From, {update_online_user, Operation} } ->
      BattleShipPid ! {From, Operation},
      server_loop(BattleShipPid);
    {From, {stop} } ->
      BattleShipPid ! {self(), stop},
      From ! {ok};
    _ ->  %any out-of-domain [interaction, stop] message is skipped
      server_loop(BattleShipPid)
  end.


%battleship daemon waits connection from
battleship_daemon(Server, OnlineUsers) ->
  receive
    {From, add} ->
      UpdatedOnlineUsers = OnlineUsers ++ [From],
      send_all(UpdatedOnlineUsers),  %% publish the updated version of the available users where 'From' has been added
      io:format("New user available: ~s ", [From]),
      io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
      battleship_daemon(Server, UpdatedOnlineUsers);
    {From, remove} ->
      UpdatedOnlineUsers = lists:delete(From, OnlineUsers),
      send_all(UpdatedOnlineUsers),  %% publish the updated version of the available users where 'From' has been removed
      send_all(UpdatedOnlineUsers, From),  %% all game requests coming from this user are deleted
      io:format("~s is now offline", [From]),
      io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
      battleship_daemon(Server, UpdatedOnlineUsers);
    {Server, stop} ->
      ok;
    _ -> battleship_daemon(Server, OnlineUsers)  %any out-of-domain [add, remove, stop] message is skipped
  end.


% It sends a message to all clients ready to start a new match
send_all(List) ->
  send_all(List, List).

send_all([], _) -> ok;

send_all([First|Others], Data) ->
  if
    (is_list(Data)) ->  %% if it is a list, it means that the list of online users has been updated
      First ! jsx:encode(#{<<"type">> => <<"updated_online_users">>, <<"data">> => Data});
    true -> %% otherwise, it is the username of a user who is no longer online
      First ! jsx:encode(#{<<"type">> => <<"remove_user_requests">>, <<"data">> => Data})
  end,
  send_all(Others, Data).